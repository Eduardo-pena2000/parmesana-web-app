const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createReservation, getMyReservations } = require('../controllers/reservationController.js');

router.post('/', auth, createReservation);
router.get('/my-reservations', auth, getMyReservations);

module.exports = router;
