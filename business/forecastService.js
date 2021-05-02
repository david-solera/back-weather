const rest = require("./restService");
const restService = rest.restService;
const city = require("./cityService");
const cityService = city.cityService;


// service object that will hold the service methods for Weather Forecast
const forecastService = {};

// urls for Weather REST API
const weeklyURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&appid=006a2717118faae82b83b91cc87e5e69&exclude=hourly,minutely&lang=es";
const dailyURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&appid=006a2717118faae82b83b91cc87e5e69&exclude=daily,minutely&lang=es";

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
        const weekForecast = handleWeeklyForecastData(res);
        // return handled response
        resolve(weekForecast);
      });
    } catch (err) {
      console.log("Error getting weekly Forecast: " + err);
      reject(err);
    }
  });
}

// gets houtly forecast for current date
forecastService.getDayForecast =  async function (cityName) {
  return new Promise(async (resolve, reject) => {
    try {
      // get city record
      const city = await cityService.getCity(cityName);

      // add City coordinates to URL
      const restURL = dailyURL + "&lat=" + city.lat + "&lon=" + city.lon;
      console.log("URL: " + restURL);

      // get the forecast (Call External Weather API)
      restService.doGet(restURL).then(res => {
        // handle the raw response from API
        const dayForecast = handleDailyForecastData(res);
        // return handled response
        resolve(dayForecast);
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

// handles a day forecast from the open weather API and creates a useful data structure
function handleDayForecastData(dayForecast) {
  let dayItem = {
    date: new Date(dayForecast.dt * 1000),
    summary: dayForecast.weather[0].main,
    temp: dayForecast.temp,
    rainProb: dayForecast.pop
  }

  return dayItem;
}

// handles the result from the open weather API and creates a useful data structure
// get hourly information for a day
function handleDailyForecastData(response) {

  let result = [];

  // get the hourly forecast and add an day item in the result object
  const parsedBody = JSON.parse(response.body);
  parsedBody.hourly.forEach(hourForecast => {
    // create new item with desired data
    const newHourItem = handleHourForecastData(hourForecast);
    // include in array
    result.push(newHourItem);
  });

  console.log('RESULT');
  console.log(result);
  return result;
}

// handles an hour forecast from the open weather API and creates a useful data structure
function handleHourForecastData(hourForecast) {
  var date = new Date(hourForecast.dt * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  let hourItem = {
    date: new Date(hourForecast.dt * 1000),
    time: formattedTime,
    summary: hourForecast.weather[0].main,
    temp: hourForecast.temp,
    rainProb: hourForecast.pop
  }

  return hourItem;
}

module.exports = { forecastService };
