const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { weatherDB } = require("./dbConfig");
const dbEntities = require("./dbEntities");

// service object that will hold the service methods
const dbService = {};

// CITY
// get city List
dbService.getCities = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.City.findAll({ order: [["cityid", "ASC"]] }).then((cityList) => {
      resolve(cityList);
    });
  });
};

// get single city detail
dbService.getCity = async function (cityName) {
  return new Promise((resolve, reject) => {
    dbEntities.City.findOne({
      where: {
        name: cityName
      }
    }).then((city) => {
      resolve(city);
    });
  });
};

// add a city record
dbService.addCity = async function (cityName, countryCode, lat, lon) {
  return new Promise((resolve, reject) => {
    dbEntities.City.create({name:cityName,countrycode:countryCode,lat:lat,lon:lon}).then((city) => {
      resolve(city);
    });
  });
};

/*
// METRIC
// get master Metrics
dbService.getMasterMetrics = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.Metric.findAll({ order: [["order", "ASC"]] }).then((metrics) => {
      resolve(metrics);
    });
  });
};

// add a new Metric
dbService.addMetric = async function (name, suffix, desc, areaId) {
  return new Promise(async (resolve, reject) => {
    const resultOrder = await kpiDB.query(
      "select max(metric.order) as maxOrder from metric",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const newOrder = resultOrder.length > 0 ? resultOrder[0].maxOrder + 10 : 10;

    dbEntities.Metric.create({
      name: name,
      suffix: suffix,
      description: desc,
      areaId: areaId,
      order: newOrder
    }).then((newMetric) => {
      resolve(newMetric);
    });
  });
};

// delete an existing Metric
dbService.deleteMetric = async function (metricId) {
  return new Promise((resolve, reject) => {
    // delete Account Metrics for the metricId
    dbEntities.AccountMetric.destroy({
      where: {
        metricId: metricId
      }
    });
    // delete Master Metric
    dbEntities.Metric.destroy({
      where: {
        id: metricId,
      },
    })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

// update an existing Metric
dbService.updateMetric = async function (metricId, name, suffix, desc, areaId) {
  return new Promise((resolve, reject) => {
    dbEntities.Metric.update(
      {
        name: name,
        suffix: suffix,
        description: desc,
        areaId: areaId,
      },
      {
        where: {
          id: metricId,
        },
      }
    ).then((updatedMetric) => {
      resolve(updatedMetric);
    });
  });
};


dbService.getMasterAccounts = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.Account.findAll({
      order: [
        ['name', 'ASC']]
    }).then((accounts) => {
      resolve(accounts);
    });
  });
};

// KPI
// get master KPIs
dbService.getMasterKPIs = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.Kpi.findAll({
      order: [
        ['order', 'ASC']]
    }).then((kpis) => {
      resolve(kpis);
    });
  });
};


// add a new KPI
dbService.addKPI = async function (name, suffix, desc, areaId, formula, minValue, maxValue) {
  return new Promise(async (resolve, reject) => {
    const resultOrder = await kpiDB.query(
      "select max(kpi.order) as maxOrder from kpi",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const newOrder = resultOrder.length > 0 ? resultOrder[0].maxOrder + 10 : 10;
    dbEntities.Kpi.create({
      name: name,
      suffix: suffix,
      description: desc,
      areaId: areaId,
      formula: formula,
      minValue: minValue,
      maxValue: maxValue,
      order: newOrder
    }).then((newKPI) => {
      resolve(newKPI);
    });
  });
};

// delete an existing KPI
dbService.deleteKPI = async function (kpiId) {
  // delete Account Kpis for the kpiId
  dbEntities.AccountKpi.destroy({
    where: {
      kpiId: kpiId
    }
  });
  // delete the masteer Kpi
  dbEntities.Kpi.destroy({
    where: {
      id: kpiId
    }
  })
};


// update an existing KPI
dbService.updateKPI = async function (
  kpiId,
  name,
  suffix,
  desc,
  areaId,
  formula,
  minValue,
  maxValue
) {
  return new Promise((resolve, reject) => {
    dbEntities.Kpi.update(
      {
        name: name,
        suffix: suffix,
        description: desc,
        areaId: areaId,
        formula: formula,
        minValue: minValue,
        maxValue: maxValue
      },
      {
        where: {
          id: kpiId,
        },
      }
    ).then((updatedKPI) => {
      resolve(updatedKPI);
    });
  });
};

// METRIC AREA
// get available Focus Areas for Metrics
dbService.getMetricFocusAreas = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.MetricArea.findAll({
      order: [
        ['name', 'ASC']]
    }).then((areas) => {
      resolve(areas);
    });
  });
};

// get Focus Areas for Id
dbService.getMetricFocusArea = async function (areaId) {
  return new Promise((resolve, reject) => {
    dbEntities.MetricArea.findOne({
      where: {
        id: areaId
      }
    }).then((area) => {
      resolve(area);
    });
  });
};

// add a new focus Area for Metrics
dbService.addMetricFocusArea = async function (name, desc) {
  return new Promise((resolve, reject) => {
    dbEntities.MetricArea.create({
      name: name,
      description: desc,
    }).then((newArea) => {
      resolve(newArea);
    });
  });
};

// delete an existing focus Area for Metrics
dbService.deleteMetricFocusArea = async function (areaId) {
  return new Promise((resolve, reject) => {
    dbEntities.Area.destroy({
      where: {
        id: areaId,
      },
    }).then((result) => {
      resolve(result);
    });
  });
};

// update an existing focus Area for Metrics
dbService.updateMetricFocusArea = async function (areaId, name, desc) {
  return new Promise((resolve, reject) => {
    dbEntities.MetricArea.update(
      {
        name: name,
        description: desc,
      },
      {
        where: {
          id: areaId,
        },
      }
    ).then((updatedArea) => {
      resolve(updatedArea);
    });
  });
};

// KPI AREA
// get available Focus Areas for KPIs
dbService.getKpiFocusAreas = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.KpiArea.findAll({
      order: [
        ['name', 'ASC']]
    }).then((areas) => {
      resolve(areas);
    });
  });
};

// add a new focus Area for KPIs
dbService.addKpiFocusArea = async function (name, desc) {
  return new Promise((resolve, reject) => {
    dbEntities.KpiArea.create({
      name: name,
      description: desc,
    }).then((newArea) => {
      resolve(newArea);
    });
  });
};

// delete an existing focus Area for KPIs
dbService.deleteKpiFocusArea = async function (areaId) {
  return new Promise((resolve, reject) => {
    dbEntities.KpiArea.destroy({
      where: {
        id: areaId,
      },
    }).then((result) => {
      resolve(result);
    });
  });
};

// update an existing focus Area for KPIs
dbService.updateMetricFocusArea = async function (areaId, name, desc) {
  return new Promise((resolve, reject) => {
    dbEntities.MetricArea.update(
      {
        name: name,
        description: desc,
      },
      {
        where: {
          id: areaId,
        },
      }
    ).then((updatedArea) => {
      resolve(updatedArea);
    });
  });
};

// get metrics by account and month
dbService.getMetricsByAccountAndMonth = async function (
  accountId,
  month,
  year
) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountMetric.findAll({
      include: [dbEntities.Metric],
      where: {
        accountId: accountId,
        month: month,
        year: year,
      },
    }).then((accountMetrics) => {
      resolve(accountMetrics);
    });
  });
};

// get metrics for admin report, based in:
// - userAccounts list of user accounts
// - start month/year
// - end month/year
dbService.getAdminReportMetrics = async function (userAccounts, startMonth, startYear, endMonth, endYear) {
  return new Promise((resolve, reject) => {
      dbEntities.AccountMetric.findAll({
        include : [
          dbEntities.Metric,
          dbEntities.Account
        ],
        where: {
          [Op.and]: [
            { accountId: userAccounts },
            {
              [Op.or]: [
                { year: {[Op.gt]: startYear}},
                { [Op.and]: [
                  { year: startYear },
                  { month: { [Op.gte]: startMonth } }
                ]
              }
            ]
          },
          {
            [Op.or]: [
              { year: { [Op.lt]: endYear } },
              {
                [Op.and]: [
                  { year: endYear },
                  { month: {[Op.lte]: endMonth}}
                ]}
              ]
            }
          ]
        },
        order: [
          [dbEntities.Account,'name', 'ASC'],
          ['year', 'ASC'],
          ['month', 'ASC'],
          [dbEntities.Metric,'id', 'ASC']
        ]
    }).then((reportMetrics) => {
      resolve(reportMetrics);
    });
  });
};

// get Kpis for admin report, based in:
// - userAccounts list of user accounts
// - start month/year
// - end month/year
dbService.getAdminReportKpis = async function (userAccounts, startMonth, startYear, endMonth, endYear) {
  return new Promise((resolve, reject) => {
      dbEntities.AccountKpi.findAll({
        include : [
            dbEntities.Kpi,
            dbEntities.Account
          ],
        where: {
          [Op.and]: [
            { accountId: userAccounts },
            {
              [Op.or]: [
                { year: {[Op.gt]: startYear}},
                { [Op.and]: [
                  { year: startYear },
                  { month: { [Op.gte]: startMonth } }
                ]
              }
            ]
          },
          {
            [Op.or]: [
              { year: { [Op.lt]: endYear } },
              {
                [Op.and]: [
                  { year: endYear },
                  { month: {[Op.lte]: endMonth}}
                ]}
              ]
            }
          ]
        },
        order: [
          //['accountId', 'ASC'],
          [dbEntities.Account,'name', 'ASC'],
          ['year', 'ASC'],
          ['month', 'ASC'],
          [dbEntities.Kpi,'id', 'ASC']
        ]
      }).then((reportKpis) => {
      resolve(reportKpis);
    });
  });
};

// get metrics by metric id, account and month
dbService.getMetricForAccountAndMonth = async function (
  metricId,
  accountId,
  month,
  year
) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountMetric.findAll({
      where: {
        metricId: metricId,
        accountId: accountId,
        month: month,
        year: year,
      },
    }).then((accountMetric) => {
      resolve(accountMetric);
    });
  });
};

// Add Account metric
dbService.addAccountMetric = async function (
  metricId,
  accountId,
  month,
  year,
  value
) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountMetric.create({
      metricId: metricId,
      accountId: accountId,
      month: month,
      year: year,
      value: value,
      date: Sequelize.fn('NOW')
    }).then((accountMetric) => {
      resolve(accountMetric);
    });
  });
};

// Update Account metric
dbService.updateAccountMetric = async function (
  metricId,
  accountId,
  month,
  year,
  value
) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountMetric.update({ value: value, date: Sequelize.fn('NOW') }, {
      where: {
        accountId: accountId,
        metricId: metricId,
        month: month,
        year: year
      }
    }).then((accountMetric) => {
      resolve(accountMetric);
    });
  });
};


// get KPIs by account and month
dbService.getKPIsByAccountAndMonth = async function (accountId, month, year) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountKpi.findAll({
      where: {
        month: month,
        accountId: accountId,
        year: year,
      },
    }).then(async (accountKPIs) => {
      resolve(accountKPIs);
    });
  });
};

// get a single KPI by account and month
dbService.getKPIByAccountAndMonth = async function (kpiId, accountId, month, year) {
  return new Promise((resolve, reject) => {
    dbEntities.AccountKpi.findAll({
      where: {
        kpiId: kpiId,
        month: month,
        accountId: accountId,
        year: year,
      },
    }).then(async (accountKPI) => {
      if (accountKPI) {
        resolve(accountKPI[0]);
      } else {
        resolve(null);
      }
    });
  });
};

// ACCOUNT
// get Account List
dbService.getAccounts = async function (id) {
  const accounts = await kpiDB.query(
    `select ua.userId, a.id, a.code, a.name, ua.isDefault from useraccess ua, account a where ua.objectId = a.id and ua.userId = ${id} order by a.code`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  return accounts;
};

dbService.getAccount = async function (id) {
  return new Promise((resolve, reject) => {
    dbEntities.Account.findOne({
      where: {
        id
      },
    }).then((account) => {
      resolve(account);
    });
  });
};

// add a new Account
dbService.addAccount = async function (code, name, countryId) {
  return new Promise((resolve, reject) => {
    dbEntities.Account.create({
      code: code,
      name: name,
      countryId: countryId,
    }).then((newAccount) => {
      resolve(newAccount);
    });
  });
};

// delete an existing Account
dbService.deleteAccount = async function (accountId) {
  return new Promise((resolve, reject) => {
    dbEntities.Account.destroy({
      where: {
        id: accountId,
      },
    })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

// update an existing Account
dbService.updateAccount = async function (accountId, code, name, logo, countryId) {
  return new Promise((resolve, reject) => {
    dbEntities.Account.update(
      {
        code: code,
        name: name,
        logo,
        countryId: countryId,
      },
      {
        where: {
          id: accountId,
        },
      }
    ).then((updatedAccount) => {
      resolve(updatedAccount);
    });
  });
};

// USER
// get User List
dbService.getUsers = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.User.findAll({
      order: [
        ['lastName', 'ASC']],

      include: [{
        model: dbEntities.UserAccess,
        where: { isDefault: 1 },
        required: false
      }]

    }).then((users) => {
      resolve(users);
    });
  });
};

// get User
dbService.getUserByMail = async function (email) {
  return new Promise((resolve, reject) => {
    dbEntities.User.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      resolve(user);
    });
  });
};

// add a new User
dbService.addUser = async function (firstName, lastName, email, admin) {
  return new Promise((resolve, reject) => {
    dbEntities.User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      admin: admin,
    }).then((newUser) => {
      resolve(newUser);
    });
  });
};

// delete an existing User
dbService.deleteUser = async function (userId) {
  return new Promise((resolve, reject) => {
    dbEntities.User.destroy({
      where: {
        id: userId,
      },
    })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

// update an existing User
dbService.updateUser = async function (
  userId,
  firstName,
  lastName,
  email,
  admin
) {
  return new Promise((resolve, reject) => {
    dbEntities.User.update(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        admin: admin,
      },
      {
        where: {
          id: userId,
        },
      }
    ).then((updatedUser) => {
      resolve(updatedUser);
    });
  });
};

// PROFILE
// get Profile List
dbService.getProfiles = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.Profile.findAll().then((profiles) => {
      resolve(profiles);
    });
  });
};

// get Profiles for user
dbService.getUserProfiles = async function (userId) {
  return new Promise((resolve, reject) => {
    dbEntities.UserProfile.findAll({
      where: {
        userId: userId,
      },
    }).then((userProfiles) => {
      resolve(userProfiles);
    });
  });
};

// add Profile to user
dbService.addUserProfile = async function (userId, profileId) {
  return new Promise((resolve, reject) => {
    dbEntities.UserProfile.create({
      userId: userId,
      profileId: profileId,
    }).then((newUserProfile) => {
      resolve(newUserProfile);
    });
  });
};

// remove Profile from user
dbService.deleteUserProfile = async function (userId, profileId) {
  return new Promise((resolve, reject) => {
    dbEntities.UserProfile.destroy({
      where: {
        userId: userId,
        profileId: profileId,
      },
    }).then((result) => {
      console.log(result);
      resolve(result);
    });
  });
};

// COUNTRY
// get Country List
dbService.getCountries = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.Country.findAll({
      order: [
        ['name', 'ASC']]
    }).then((countries) => {
      resolve(countries);
    });
  });
};

dbService.getUserAccess = async function () {
  return new Promise((resolve, reject) => {
    dbEntities.UserAccess.findAll({
      order: [
        ['userId', 'ASC']]
    }).then((useraccess) => {
      resolve(useraccess);
    });
  });
};

dbService.addUserAccess = async function (userId, levelId, objectId, isDefault) {
  return new Promise((resolve, reject) => {
    dbEntities.UserAccess.create({
      userId: userId,
      levelId: levelId,
      objectId: objectId,
      isDefault: isDefault
    }).then((newUserAccess) => {
      resolve(newUserAccess);
    });
  });
};

dbService.updateUserAccess = async function (id, userId, levelId, objectId, isDefault) {
  return new Promise((resolve, reject) => {
    dbEntities.UserAccess.update(
      {
        userId: userId,
        levelId: levelId,
        objectId: objectId,
        isDefault: isDefault,
      },
      {
        where: {
          id: id,
        },
      }
    ).then((updatedUserAccess) => {
      resolve(updatedUserAccess);
    });
  });
};

dbService.deleteUserAccess = async function (id) {
  return new Promise((resolve, reject) => {
    dbEntities.UserAccess.destroy({
      where: {
        id: id,
      },
    })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

dbService.setOneDefaultAccount = async function (userId, objectId) {
  const useraccesses1 = await kpiDB.query(
    `update useraccess ua set ua.isDefault = 0 where ua.userId = ${userId} and ua.levelId = 1 and ua.objectId <> ${objectId} `,
    { type: Sequelize.QueryTypes.UPDATE }
  );

  dbEntities.UserAccess.findOne({
    where: {
      userId: userId,
      levelId: 1,
      objectId: objectId
    },
  }).then(async (useraccess) => {
    console.log("useraccess: " + useraccess);
    if (useraccess === null) {
      const useraccesses3 = await kpiDB.query(
        `insert into useraccess  (userId,levelId,objectId,isDefault) values (${userId}, 1, ${objectId}, 1)`,
        // set ua.isDefault = 1 where ua.userId = ${userId} and ua.objectId = ${objectId} and ua.levelId = 1` ,
        { type: Sequelize.QueryTypes.INSERT }
      );
    }
    else {
      const useraccesses4 = await kpiDB.query(
        `update useraccess ua set ua.isDefault = 1 where ua.userId = ${userId} and ua.levelId = 1 and ua.objectId = ${objectId} `,
        { type: Sequelize.QueryTypes.UPDATE }
      );
    }
  });
};

// get a single KPI by account and month
dbService.getUsersToMailingDay12 = async function () {
  const now = moment();
  const users = await dbService.getUsers();

  // for each user look into account metric
  userAccounts = users.map(function (elem) {
    return {"account":elem.useraccesses[0].objectId, "email":elem.email};
  }.bind(this));
  const filtered = userAccounts.reduce((a, o) => (a.push(o.account), a), []);
  const startMonth = now.format("M") - 1;
  const startYear = now.format("Y");
  const metrics = await dbService.getAdminReportMetrics(filtered, startMonth, startYear, startMonth, startYear);
  var users_day12 = '';
  userAccounts.forEach(user =>{

    const found = metrics.find(element => element.accountId === user.account);
    if (!found) {
      users_day12 += user.email + ";";
    }
    // Send mail to that email user with the account id.
  });
  return(users_day12);
};
*/

module.exports = { dbService };
