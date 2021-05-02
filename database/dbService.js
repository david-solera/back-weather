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


module.exports = { dbService };
