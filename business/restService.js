const request = require('request');

// service object to connect to external REST APIs
const restService = {};

// performs a GET invocation to a REST Service
restService.doGet =  async function (url) {
  return new Promise(async (resolve, reject) => {
    try {
      // set options
      const options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
      };
    
      // execute the request
      request.get(options, (error, response) => {
        if (error) {
          console.error("Error: ", error);
          reject(error);
        } else {
          resolve(response)
        }  
      });
    } catch (err) {
      console.log("Error executing GET request: " + err);
      reject(err);
    }
  });
}

module.exports = { restService };
