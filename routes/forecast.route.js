const express = require('express');
const router = express.Router();

const forecast_controller = require('../controllers/forecast.controller');

router.post('/week',forecast_controller.getWeekForecast);
router.post('/day',forecast_controller.getDayForecast);
router.post('/current',forecast_controller.getCurrentWeather);

module.exports = router;


