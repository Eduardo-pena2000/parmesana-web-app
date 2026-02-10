const { Reservation, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
    try {
        const { date, time, guests, specialRequests, contactPhone, contactName, occasion } = req.body;
        const userId = req.user.id;

        // Basic validation
        if (!date || !time || !guests || !contactPhone || !contactName) {
            return res.status(400).json({
                success: false,
                message: 'Por favor complete todos los campos requeridos'
            });
        }

        // Validate date is not in the past
        const reservationDate = new Date(`${date}T${time}`);
        if (reservationDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de reservación no puede ser en el pasado'
            });
        }

        // Check availability (Mock logic for now - assume max 10 tables per slot)
        const existingReservations = await Reservation.count({
            where: {
                date,
                time,
                status: { [Op.not]: 'cancelled' }
            }
        });

        if (existingReservations >= 10) {
            return res.status(400).json({
                success: false,
                message: 'Lo sentimos, no hay mesas disponibles para ese horario'
            });
        }

        // Generate reservation number
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const reservationNumber = `RES${year}${month}${day}${random}`;

        // Create reservation
        const reservation = await Reservation.create({
            userId,
            reservationNumber,
            date,
            time,
            guests,
            specialRequests,
            contactPhone,
            contactName,
            occasion,
            status: 'pending' // Default status
        });

        res.status(201).json({
            success: true,
            message: 'Reservación creada exitosamente',
            data: { reservation }
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({
            success: false,
            message: `Error: ${error.message}`,
            error: error.message
        });
    }
};

// @desc    Get user reservations
// @route   GET /api/reservations/my-reservations
// @access  Private
exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;

        const reservations = await Reservation.findAll({
            where: { userId },
            order: [['date', 'DESC'], ['time', 'DESC']]
        });

        res.json({
            success: true,
            count: reservations.length,
            data: { reservations }
        });

    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus reservaciones',
            error: error.message
        });
    }
};
