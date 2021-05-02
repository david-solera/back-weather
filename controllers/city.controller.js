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

// add a city to the Database
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

// return a list of cities from the database
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

// update a city in the Database
function updateCity(req, res, next) {
// TO BE COMPLETED...
}

// delete a city from the Database
function deleteCity(req, res, next) {
// TO BE COMPLETED...
}

module.exports = {
    addCity: addCity,
    getCity: getCity,
    locateCity: locateCity,
    listCities: listCities,
    updateCity: updateCity,
    deleteCity: deleteCity
};