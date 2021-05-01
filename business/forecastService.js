const rest = require("./restService");
const restService = rest.restService;
const city = require("./cityService");
const cityService = city.cityService;


// service object that will hold the service methods for Weather Forecast
const forecastService = {};

// urls for Weather REST API
const weeklyURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&appid=006a2717118faae82b83b91cc87e5e69&exclude=hourly,minutely&lang=es";

// gets forecast for next week
forecastService.getWeekForecast =  async function (cityName) {
  return new Promise(async (resolve, reject) => {
    try {
      // get city record
      const city = await cityService.getCity(cityName);
      console.log('CIUDAD');
      console.log(city);

      // add City coordinates to URL
      const restURL = weeklyURL + "&lat=" + city.lat + "&lon=" + city.lon;
      console.log("URL: " + restURL);

      // get the forecast (Call External Weather API)
      restService.doGet(restURL).then(res => {
        resolve(res);
      });
    } catch (err) {
      console.log("Error getting weekly Forecast: " + err);
      reject(err);
    }
  });
}

module.exports = { forecastService };
