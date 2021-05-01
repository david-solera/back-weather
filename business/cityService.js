const ExcelJS = require("exceljs");
const Sequelize = require('sequelize');
const dbEntities = require("../database/dbEntities");
const db = require("../database/dbService");
const dbService = db.dbService;
const i18next = require("i18next");
const { mailService } = require('./mailService')


// service object that will hold the service methods
const buService = {};

// read the metrics form an excel file
// return a JSON file with the contents (name, value) where name is the metric ID
buService.getMetricsFromFile =  async function (buffer, accountId, month, year) {
  return new Promise(async (resolve, reject) => {
    try {
      var metrics = [];

      // get account for current id
      const account = await dbService.getAccount(accountId);

      var workbook = new ExcelJS.Workbook();

      // get workbook
      await workbook.xlsx.load(buffer);

      // get first sheet
      const sheet = workbook.worksheets[0];

      // iterate on the rows (skip first row for headers) till the second column of the row (metric code) is empty
      var moreRows = true;
      var rowIndex = 1;
      while (moreRows) {
        var row = sheet.getRow(++rowIndex);
        // get the code
        const metricCode = row.getCell(2).text;
        if (metricCode !== null && metricCode.length > 0) {
          // check if data is valid
          if(await dataIsValid(row, account.name, month, year)) {
            // get the value
            const metricValue = row.getCell(5).text;
            metrics.push({ code: metricCode, value: metricValue });
          } else {
            // return a validation error
            throw("Invalid Account or Date");
          }
        } else {
          // cell is empty, so no more rows
          moreRows = false;
          resolve(metrics);
        }
      }
    } catch (err) {
      console.log("Error reading file: " + err);
      reject(err);
    }
  });
}

// validate account and date (month/year)
async function dataIsValid(row, accountName, month, year) {
  return new Promise(async (resolve, reject) => {
    try {
      // check account id
      const fileAccountName = row.getCell(6).text;
      if(accountName !== fileAccountName) {
        resolve(false);
      }

      // check date
      const fileMonth = row.getCell(7).text;
      const fileYear = row.getCell(8).text;

      // if month comes as text check it also
      const textMonth = i18next.t('month.' + month);

      if((month !== fileMonth && textMonth !== fileMonth) || year !== fileYear) {
        resolve(false);
      }

      // if everything is valid, return true
      resolve(true);
    } catch (err) {
      console.log("Error reading file: " + err);
      reject(err);
    }
  });

}

// save metrics by account and month/year - Improved Performance
buService.saveAccountMetrics = async function (accountId, metricValues, month, year) {
  return new Promise(async (resolve, reject) => {
      // get Current metrics from database
      const currentMetricList = await dbService.getMetricsByAccountAndMonth(accountId,month,year);
      // iterate on the metrics provided
      for(metric of metricValues) {
        // check if the metric alreday exist in the current metric list
        const currentMetric = currentMetricList.find(item => item.metricId === parseInt(metric.name));

        if(currentMetric) {
          // if exist check if the value has been changed
          if(currentMetric.value !== parseFloat(metric.value)) {
            // if value is different -> update it
            dbService.updateAccountMetric(metric.name, accountId, month, year, metric.value ? metric.value : 0);
          }
        } else {
          // if metric does not exist -> create it
          dbService.addAccountMetric(metric.name, accountId, month, year, metric.value);
        }
      }
      resolve();
    });
};

// save kpis by account and month/year (Their values can be updated by the user from the application)
buService.saveAccountKpis = async function (accountId, kpiValues, month, year) {
  return new Promise(async (resolve, reject) => {
      // iterate on the metrics provided
      for(kpi of kpiValues) {
          if(kpi.name && kpi.value) {
            const [accountKPI, created] = await dbEntities.AccountKpi.findOrCreate({
              where: {
                  accountId: accountId,
                  kpiId: kpi.name,
                  month: month,
                  year: year
              },
              defaults: {
                value: kpi.value,
                reason: kpi.description,
                date: Sequelize.fn('NOW')
              }
            });
            if (created) {
                // already created by findOrCreate method
                console.log('CREATED');
            } else {
                // need to update
                accountKPI.value = kpi.value;
                accountKPI.reason = kpi.description;
                accountKPI.date = Sequelize.fn('NOW');
                await accountKPI.save();
                console.log('UPDATED');
            }
          }
      }
      resolve();
    });
};

// calculate the KPIs for an account, in an specific month and year
buService.calculateKPIs =  async function (accountId, month, year) {
  return new Promise(async (resolve, reject) => {
    try {
      // get Master KPI List
      const masterKPIs = await dbService.getMasterKPIs();

      // get Metric List so we can use them in the calculations
      var metricList = await dbService.getMetricsByAccountAndMonth(accountId,month,year);
      metricList = metricList.map(item => ({id: item.metric.id, value: item.value}));

      // iterate on kpi list to create/update account KPI for the specific account and month/year
      for(kpi of masterKPIs) {
        // get formula
        const formula = kpi.formula;

        // replace values in formula and perform calculatiom
        if(formula) {
          const calculatedValue = await calculateFormula(accountId, formula, month, year, metricList);

          // only if value can be calculated
          if(calculatedValue !== null) {
            // create/update account KPI
            // check if the metric already exist
            const [accountKPI, created] = await dbEntities.AccountKpi.findOrCreate({
              where: {
                  accountId: accountId,
                  kpiId: kpi.id,
                  month: month,
                  year: year
              },
              defaults: {
                value: calculatedValue,
                date: Sequelize.fn('NOW')
              }
            });
            if (created) {
                // already created by findOrCreate method
                console.log('CREATED');
            } else {
                // need to update
                accountKPI.value = calculatedValue;
                accountKPI.date = Sequelize.fn('NOW');
                await accountKPI.save();
                console.log('UPDATED');
            }
          }
        }
      }

      // if everything ok - Return
      resolve();
    } catch (err) {
      console.log("Error calculating KPIs: " + err);
      reject(err);
    }
  });
}


// for a given formula, replace the values of variables and perform the calculation
async function calculateFormula(accountId, formula, month, year, metricList) {
  return new Promise(async (resolve, reject) => {
    try {
      var calculatedValue=0;
      var formulaStr = formula;

      // get tokens to replace from formula, each token represents a metric
      var metricTokenList = [];
      formulaStr.replace(/\{(.*?)}/g, function(a, metricCode) {
            metricTokenList.push({key: metricCode, value: 0});
      });

      // get the values for the metric Ids stored in the tokens
      if(await getMetricValuesToReplace(metricTokenList,metricList, accountId, month, year)) {

        // replace token keys by values in formula
        for(var token of metricTokenList) {
          const regex = new RegExp('\{' + token.key + '\}','g');
          formula = formula.replace(regex, token.value);
        }

        // perform the calculation
        calculatedValue = eval(formula);

        // use only one decimal position
        //calculatedValue = Math.round(calculatedValue * 10) / 10;
        calculatedValue = calculatedValue.toFixed(2);

        // return value
        resolve(calculatedValue);
      } else {
        // some tokes nas no value, formula cannot be calculated so return null
        resolve(null);
      }
    } catch (err) {
      console.log("Error calculating Formula: " + err);
      reject(err);
    }
  });
}

async function getMetricValuesToReplace(metricTokenList,metricValuesList, accountId, month, year) {
  var valueMetric;

  return new Promise(async (resolve, reject) => {
    try {

      for(var token of metricTokenList) {
        // check if the token is for a metric or a KPI
        if(token.key.startsWith('M')) {
          // token is a metric
          // get the metric Id: remove 'M' and left '0s'
          const metricId = token.key.replace(/M0+/, '');

          // find value from metrics value list
          valueMetric = metricValuesList.find(item => item.id===parseInt(metricId));
        } else if (token.key.startsWith('K')) {
          // token is a KPI
          const kpiId = token.key.replace(/K0+/, '');
          // get KPI from database
          const kpi = await dbService.getKPIByAccountAndMonth(kpiId,accountId,month,year);
          if(kpi && kpi.value) {
            valueMetric = kpi;
          }
        }

        if (valueMetric) {
          // set value in token list
          token.value = valueMetric.value;
        } else {
          // it is not possible to find some metric value for the calculation
          resolve(false);
        }
      }
      // everything ok
      resolve(true);
    } catch (err) {
      console.log("Error getting values to replae in formula: " + err);
      reject(err);
    }
  });
}


// get metrics for account, month and year and write the in a file
buService.writeMetricsFile = async function (accountId, month, year) {
  return new Promise(async (resolve, reject) => {
    try {

      // get metrics
      const metrics = await dbService.getMetricsByAccountAndMonth(accountId,month,year);

      // write metrics in file
      const filePath = await getMetricsFile(metrics, accountId, month, year);
      console.log('Path name: ' + filePath);

      // if everything ok - Return file path
      resolve(filePath);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}

async function getMetricsFile(metricList, accountId, month, year) {
  return new Promise(async (resolve, reject) => {
    try {
      const path = './public/outputFiles/exportMetrics.xlsx';

      // create excel file
      const workbook = new ExcelJS.Workbook();

      // create sheet
      const metricSheet = workbook.addWorksheet('Metrics');

      // get Master Metric List
      const masterMetrics = await dbService.getMasterMetrics();

      // get Account
      const account = await dbService.getAccount(accountId);

      // the month is written with the name (in the user language)
      const monthName = i18next.t('month.' + month);

      // add header row (BOLD)
      var currentRow = metricSheet.addRow(getMetricFileHeadersRow());
      currentRow.font = {bold:true};

      // iterate on the metrics, and create a row per metric
      for(metric of masterMetrics) {
        // add metric row
        metricSheet.addRow(await getMetricFileRow(metric, metricList, account.name, monthName, year));
      }

      // write file
      await workbook.xlsx.writeFile(path);

      // if everything ok - Return file path
      resolve(path);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}

// create new row for a given master metric
async function getMetricFileRow(masterMetric, metricList, accountName, monthName, year) {
    // create empty row
    var rowList = [];

    // find account metric for master metric
    const accountMetric = metricList.find(item => (item.metricId === masterMetric.id || item.kpiId === masterMetric.id));

    // get area Id add push area Name
    const metricArea = await dbService.getMetricFocusArea(masterMetric.areaId);
    rowList.push(metricArea.name);

    // add metric Code
    rowList.push(formatMetricCode(masterMetric));

    // add metric Name
    rowList.push(masterMetric.name);

    // add metric description
    rowList.push(masterMetric.description);

    // add metric value
    if(accountMetric) {
      rowList.push(accountMetric.value);
    } else {
      // if metric is not present for the account/month/year combination, set default value
      rowList.push('');
    }
    

    // add Account Name
    rowList.push(accountName);

    // add Month
    rowList.push(monthName);

    // add Year
    rowList.push(year);

    return rowList;
}

// return a list with the headers to be used in metrics file export
function getMetricFileHeadersRow() {
  var headerList = [];

  //
  headerList.push(i18next.t('exportFile.area'));
  headerList.push(i18next.t('exportFile.metricCode'));
  headerList.push(i18next.t('exportFile.metricName'));
  headerList.push(i18next.t('exportFile.metricDefinition'));
  headerList.push(i18next.t('exportFile.metricValue'));

  // Account, year and month
  headerList.push(i18next.t('exportFile.account'));
  headerList.push(i18next.t('exportFile.month'));
  headerList.push(i18next.t('exportFile.year'));

  return headerList;
}

// return a list with the headers to be used in metrics/kpis file export
function getFileHeadersRow(masterItems) {
  var headerList = [];

  // Account, year and month
  headerList.push(i18next.t('exportFile.account'));
  headerList.push(i18next.t('exportFile.year'));
  headerList.push(i18next.t('exportFile.month'));

  // iterate on the metrics/kpis, and add a header per item with the name
  for(item of masterItems) {
    headerList.push(item.name);
  }

  return headerList;
}

// return a list with the metric Codes to be used in metrics file export
function getMetricCodesRow(metricList) {
  // 3 blank cells (account, year and month)
  var rowList = ['','',''];

  // iterate on the metrics, and add a header per metric with the metric name
  for(item of metricList) {
    rowList.push(formatMetricCode(item));
  }

  return rowList;
}

// return a list with the Codes to be used in metric/kpis file export
function getKpiCodesRow(masterItems) {
  // 3 blank cells (account, year and month)
  var codeList = ['','',''];

  // iterate on the items, and add a header per item with the code
  for(item of masterItems) {
    codeList.push(formatKpiCode(item));
  }

  return codeList;
}

// return a list with the values to be used in metrics file export
async function getValuesRow(objectList, masterObjects, accountId, month, year) {
  // account
  const account = await dbService.getAccount(accountId);
  var rowList = [account.name];

  // year and month
  rowList.push(year);
  // the month is written with the name (in the user language)
  rowList.push(i18next.t('month.' + month));

  // iterate on the metrics, and add the values
  for(masterObject of masterObjects) {
    // find the metric id in the provided list and add it to the result list
    // if it is not present, add an empty cell
    const foundItem = objectList.find(item => (item.metricId === masterObject.id || item.kpiId === masterObject.id));
    if(foundItem) {
      rowList.push(foundItem.value);
    } else {
      // and empty cell
      rowList.push('');
    }
  }

  return rowList;
}


// returns a string like 'M001', 'M002'... for a given metric id (1, 2,...)
function formatMetricCode(metric) {
  var formatedCode = '00' + metric.id;
  if(metric.id > 0) {
   formatedCode = 'M' + formatedCode.substr(formatedCode.length - 3);
  }
  return formatedCode;
}

// returns a string like 'K001', 'K002'... for a given Kpi id (1, 2,...)
function formatKpiCode(kpi) {
  var formatedCode = '00' + kpi.id;
  if(kpi.id > 0) {
   formatedCode = 'K' + formatedCode.substr(formatedCode.length - 3);
  }
  return formatedCode;
}

// Autoregistration process for a user
// - create an application user in the DB
// - send email to administrators so they can assign accounts to the user
buService.autoRegisterUser = async function(email, name) {
  return new Promise(async (resolve, reject) => {
    try {
      // register the user - not an admin
      const nameTokens = name.split(", ");
      const firstName = nameTokens[1];
      const lastName = nameTokens[0];
      const newUser = await dbService.addUser(firstName, lastName, email, 0);

      // send an email to administrators
      mailService.sendMailToAdmins(firstName, lastName, email);

      // if everything is ok, return the user
      resolve(newUser);
    } catch (err) {
      console.log("Error in user autoregistration: " + err);
      reject(err);
    }
  });
}

// admin reports
// get metrics for account, start/end month and year and write the in a file
buService.writeAdminMetricsFile = async function (userAccounts,startMonth,startYear,endMonth,endYear) {
  return new Promise(async (resolve, reject) => {
    try {

      // get metrics
      const metrics = await dbService.getAdminReportMetrics(userAccounts,startMonth,startYear,endMonth,endYear);

      // write metrics in file
      const filePath = await getAdminMetricsFile(metrics);

      // if everything ok - Return file path
      resolve(filePath);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}

// get kpis for account id list, start/end month and year and write the in a file
buService.writeAdminKpisFile = async function (userAccounts,startMonth,startYear,endMonth,endYear) {
  return new Promise(async (resolve, reject) => {
    try {

      // get Kpis
      const kpis = await dbService.getAdminReportKpis(userAccounts,startMonth,startYear,endMonth,endYear);

      // write metrics in file
      const filePath = await getAdminKpisFile(kpis);

      // if everything ok - Return file path
      resolve(filePath);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}

async function getAdminMetricsFile(metricList) {
  return new Promise(async (resolve, reject) => {
    try {
      const path = './public/outputFiles/exportAdminMetrics.xlsx';

      // create excel file
      const workbook = new ExcelJS.Workbook();

      // create sheet
      const metricSheet = workbook.addWorksheet('Metrics');

      // get Master Metric List
      const masterMetrics = await dbService.getMasterMetrics();

      // add header row (BOLD)
      var currentRow = metricSheet.addRow(await getFileHeadersRow(masterMetrics));
      currentRow.font = {bold:true};

      // add Metric Codes row
      currentRow = metricSheet.addRow(await getMetricCodesRow(masterMetrics));

      // add rows with values
      await addAdminValueRows(metricSheet, metricList, masterMetrics);

      // write file
      await workbook.xlsx.writeFile(path);

      // if everything ok - Return file path
      resolve(path);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}

async function getAdminKpisFile(kpiList) {
  return new Promise(async (resolve, reject) => {
    try {
      const path = './public/outputFiles/exportAdminKpis.xlsx';

      // create excel file
      const workbook = new ExcelJS.Workbook();

      // create sheet
      const sheet = workbook.addWorksheet('KPIs');

      // get Master KPI List
      const masterKpis = await dbService.getMasterKPIs();

      // add header row (BOLD)
      var currentRow = sheet.addRow(await getFileHeadersRow(masterKpis));
      currentRow.font = {bold:true};

      // add Metric Codes row
      currentRow = sheet.addRow(await getKpiCodesRow(masterKpis));

      // add rows with values
      await addAdminValueRows(sheet, kpiList, masterKpis);

      // write file
      await workbook.xlsx.writeFile(path);

      // if everything ok - Return file path
      resolve(path);
    } catch (err) {
      console.log("Error writing metrics in file: " + err);
      reject(err);
    }
  });
}


async function addAdminValueRows(sheet, objectList, masterObjects) {
  // convert list of values  in list of rows (one row per Account/month/Year)
  const listOfRows = getListOfRows(objectList);

  // iterate on the list of rows
  for (row of listOfRows) {
    // get account, year and month from first element in the row (it is the same for all the row)
    const accountId = row[0].accountId;
    const year = row[0].year;
    const month = row[0].month;
    // add values for each row to the excel sheet
    sheet.addRow(await getValuesRow(row,masterObjects,accountId, month, year));
  }
}

// covert a list of values, ina list of rows (one row per Account/month/Year)
function getListOfRows(objectList) {
  var rowValues = [];
  var listOfRows = []
  var previousAccountId, previousYear, previousMonth;

  // iterate on the list
  for (const item of objectList) {
    // get raw values
    const accountId = item.accountId;
    const year = item.year;
    const month = item.month;

    // check if a new row has to be created
    if(isNewRow(previousAccountId, previousYear, previousMonth, accountId, year, month)) {
      // add the previous row to the list of Rows
      if(rowValues.length > 0) {
        listOfRows.push(rowValues);
      }
      // initialize new row
      rowValues = [];
    }

    // add the value to the row
    rowValues.push(item);

    // update previous values
    previousAccountId = accountId;
    previousYear = year;
    previousMonth = month;
  }
  // add last row processed
  if(rowValues.length > 0) {
    listOfRows.push(rowValues);
  }

  return listOfRows;
}


// return true if previous values are differents from new (new row has to be created)
// false otherwise (use the same row)
function isNewRow(previousAccountId, previousYear, previousMonth, accountId, year, month) {

  if(previousAccountId===accountId && previousYear===year && previousMonth===month) {
    // use same row
    return false;
  } else {
    //something is different, create new row
    return true;
  }
}


module.exports = { buService };
