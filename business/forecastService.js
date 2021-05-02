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
        // handle the raw response from API
        const weekForectas = handleWeeklyForecastData(res);
        // return handled response
        resolve(weekForectas);
      });
    } catch (err) {
      console.log("Error getting weekly Forecast: " + err);
      reject(err);
    }
  });
}

// handles the result from the open weather API and creates a useful data structure
function handleWeeklyForecastData(response) {

  let result = [];

  console.log('BODY');
  console.log(JSON.parse(response.body).daily[0]);
  console.log('WEATHER');
  console.log(JSON.parse(response.body).daily[0].weather);
  // get the daily forecast and add an day item in the result object
  const parsedBody = JSON.parse(response.body);
  parsedBody.daily.forEach(dayForecast => {
    // create new item with desired data
    const newDayItem = handleDayForecastData(dayForecast);
    // include in array
    result.push(newDayItem);
  });

  return result;
}

// handles the a day forecast from the open weather API and creates a useful data structure
function handleDayForecastData(dayForecast) {
  let dayItem = {
    date: new Date(dayForecast.dt * 1000),
    summary: dayForecast.weather[0].main,
    temp: dayForecast.temp,
    rainProb: dayForecast.pop
  }

  return dayItem;
}


module.exports = { forecastService };
