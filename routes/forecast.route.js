const express = require('express');
const router = express.Router();

const forecast_controller = require('../controllers/forecast.controller');

router.get('/week',forecast_controller.getWeekForecast);
router.get('/day',forecast_controller.getDayForecast);
router.get('/current',forecast_controller.getCurrentForecast);

module.exports = router;


