const db = require("../database/dbService");
const dbService = db.dbService;


// service object that will hold the service methods for Weather Forecast
const forecastService = {};

// gets forecast for next week
forecastService.getWeekForecast =  async function (cityName) {
  return new Promise(async (resolve, reject) => {
    try {
      // get city from DB
      const city = await dbService.get(cityName);

      // get the forecast (Call External Weather API)
      const forecast = {};

      resolve(forecast);
    } catch (err) {
      console.log("Error getting weekly Forecast: " + err);
      reject(err);
    }
  });
}

module.exports = { forecastService };
