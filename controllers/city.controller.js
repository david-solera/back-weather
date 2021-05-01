const city = require("./../business/cityService");
const cityService = city.cityService;

// gets a City Record from DB by its name
function getCity(req, res, next) {
    // get params
    const cityName = req.params.name;

    // add city
    cityService.getCity(cityName).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'City Retrieved'
        })
    }).catch(function (err) {
        return next(err);
    })
}

// gets geolocalization for a City, by its name and country code
function locateCity(req, res, next) {
    // get params
    const cityName = req.body.name;
    const countryCode = req.body.country;   

    // locate city
    cityService.locateCity(cityName, countryCode).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'City GEO LOCALIZED'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function addCity(req, res, next) {
    // get params
    const cityName = req.body.name;
    const country = req.body.country;

    // add city
    cityService.addCity(cityName, country).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'City Added'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function listCities(req, res, next) {
    // add city
    cityService.listCities().then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'Retrieved City List'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function updateCity(req, res, next) {
    // add city
    cityService.addCity(params).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'City Updated'
        })
    }).catch(function (err) {
        return next(err);
    })
}

function deleteCity(req, res, next) {
    // add city
    cityService.addCity(params).then(function (data) {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'City deleted'
        })
    }).catch(function (err) {
        return next(err);
    })
}

module.exports = {
    addCity: addCity,
    getCity: getCity,
    locateCity: locateCity,
    listCities: listCities,
    updateCity: updateCity,
    deleteCity: deleteCity
};