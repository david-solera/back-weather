const express = require('express');
const app = express();

// route component definition
const city_routing = require('./routes/city.route');
const forecast_routing = require('./routes/forecast.route');

// main routing definition
app.use('/city', city_routing);
app.use('/forecast', forecast_routing);

//const database = require('./controllers/database');
//const client = database.db;

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);


let port = 1234;

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});




