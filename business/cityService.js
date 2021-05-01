const db = require("../database/dbService");
const dbService = db.dbService;
const rest = require("./restService");
const restService = rest.restService;


// service object that will hold the service methods for Cities
const cityService = {};

// urls for Weather REST API
const geolocateURL = "http://api.openweathermap.org/geo/1.0/direct?limit=1&appid=006a2717118faae82b83b91cc87e5e69";

// gets the cities list from DDBB
cityService.listCities =  async function () {
  return new Promise(async (resolve, reject) => {
    try {
      // get cities from DB
      const cities = await dbService.getCities();
      resolve(cities);
    } catch (err) {
      console.log("Error getting city List: " + err);
      reject(err);
    }
  });
}

// gets a single city record from DDBB
cityService.getCity =  async function (cityName) {
  return new Promise(async (resolve, reject) => {
    try {
      // get city from DB
      const city = await dbService.getCity(cityName);
      resolve(city);
    } catch (err) {
      console.log("Error getting city List: " + err);
      reject(err);
    }
  });
}

// Geo Locate a City base on city name and country
cityService.locateCity =  async function (cityName, countryCode) {
  return new Promise(async (resolve, reject) => {
    try {
      let restURL = geolocateURL + "&q=" + cityName;
      if(countryCode) {
        restURL += "," + countryCode;
      }
      
      // Locate city (Call External Weather API)
      restService.doGet(restURL).then(res => {
        resolve(res);
      });
    } catch (err) {
      console.log("Error geolocating city: " + err);
      reject(err);
    }
  });
}

module.exports = { cityService };
