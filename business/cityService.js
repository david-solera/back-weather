const db = require("../database/dbService");
const dbService = db.dbService;

// service object that will hold the service methods for Cities
const cityService = {};

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

module.exports = { cityService };
