const express = require('express');
const router = express.Router();

// controller to use
const city_controller = require('../controllers/city.controller');

// routing definition for cities
router.get('/detail/:name',city_controller.getCity);
router.get('/list',city_controller.listCities);
router.post('/locate',city_controller.locateCity);
router.post('/add',city_controller.addCity);
router.post('/update',city_controller.updateCity);
router.post('/delete',city_controller.deleteCity);

module.exports = router;


