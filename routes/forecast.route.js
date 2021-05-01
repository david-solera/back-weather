const express = require('express');
const router = express.Router();

const forecast_controller = require('../controllers/forecast.controller');

router.get('/list',forecast_controller.decisiones_list);
router.post('/add',forecast_controller.decisiones_add);
router.post('/edit',forecast_controller.decisiones_update);
router.post('/delete',forecast_controller.decisiones_delete);


module.exports = router;


