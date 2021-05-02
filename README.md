# Weather Forecast BACKEND

This is a NodeJS project.
It wil provide a REST API to get info about the Weaher forecast.

**Installation**
- Install dependencies: npm i
- Run: npm start

Currently deployed on Heroku platform, available in https://back-weather.herokuapp.com/

The following REST API are available:

**city/list**: List of cities available in teh system (GET)

**city/detail/:name**: Detail of a specified city (GET)

**city/locate**: Provide Geolocalization details of a specified city (POST)

**city/add**: Add a city specified to the system (provide city name an country code in body) (POST)

**forecast/week**: Gets the weather forecast for next week for a provided city (POST)

**forecast/day**: Gets the weather forecast for current day (next 48 hours) for a provided city (POST)

**forecast/current**: Gets the current weather for a provided city (POST)


**ARQUITECTURE**

- NodeJS Application.
- Once one of the api urls are called, this main sequence is performed: Route -> Controller -> Service (Business, Database, Backend)
- Different modules to separate logic, business and responsabilities
- Use of Open Weather public API (Free Subscription) to get Citi locatin and weather forecast information
- PostgreSQL database hosted in Heroku platform to store persistent application data
- Use of Sequelize library to access DB

**TO BE IMPROVED**
- Complete city api with 'update' and 'delete' operations
- Use Configuration for environment variables, for instance database settings (Not done due to problems deploying to Heraku)
- Explore a non-relational DB
- Include more data in API responses.
- More detailed documentation
- Unit Testing
- ...
 