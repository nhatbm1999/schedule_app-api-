const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event_controller');

router.post('/event', eventController.Create);
router.get('/event', eventController.Read);
router.delete('/event', eventController.Delete);

module.exports = router;