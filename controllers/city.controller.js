const cityService = require("./../business/cityService");

function addCity(req, res, next) {
    // add city
    cityService.addCity(params).then(function (data) {
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
    cityService.listCities(params).then(function (data) {
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
    listCities: listCities,
    updateCity: updateCity,
    deleteCity: deleteCity
};