const express = require('express');
const router = express.Router();

// controller to use
const city_controller = require('../controllers/city.controller');

// routing definition for cities
router.get('/list',city_controller.decisiones_list);
router.post('/add',city_controller.decisiones_add);
router.post('/edit',city_controller.decisiones_update);
router.post('/delete',city_controller.decisiones_delete);

module.exports = router;


