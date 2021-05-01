const forecast = require("../business/forecastService");
const forecastService = forecast.forecastService;

function getWeekForecast(req, res, next) {
    // get params (Mocked by the moment -- get from request!!!)
    const initDate = '01/05/2021';
    const city = 'Zaragoza'

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

function getDayForecast(req, res, next) {
    // get params (Mocked by the moment -- get from request!!!)
    const date = '03/05/2021';
    const city = 'Zaragoza'

    // get forecast a single day
    forecastService.getDayForecast(date, city).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Day Forecast retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function getCurrentForecast(req, res, next) {
    // get params (Mocked by the moment -- get from request!!!)
    const city = 'Zaragoza'

    // get current forecast 
    forecastService.getCurrentForecast(city).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Current Forecast retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

module.exports = {
    getWeekForecast: getWeekForecast,
    getDayForecast: getDayForecast,
    getCurrentForecast: getCurrentForecast    
};