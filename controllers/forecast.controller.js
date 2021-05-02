const forecast = require("../business/forecastService");
const forecastService = forecast.forecastService;

// get week forecast for a provided city
function getWeekForecast(req, res, next) {
    // get params
    const city = req.body.city;

    // get forecast a whole week
    forecastService.getWeekForecast(city).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Week Forecast retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

// get day forecast for a provided city
function getDayForecast(req, res, next) {
    // get params
    const city = req.body.city;

    // get forecast a single day
    forecastService.getDayForecast(city).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Day Forecast retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

// get current weather for a provided city
function getCurrentWeather(req, res, next) {
    // get params
    const city = req.body.city;

    // get current forecast 
    forecastService.getCurrentWeather(city).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Current Weather retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

module.exports = {
    getWeekForecast: getWeekForecast,
    getDayForecast: getDayForecast,
    getCurrentWeather: getCurrentWeather    
};