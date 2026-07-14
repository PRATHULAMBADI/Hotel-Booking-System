const express = require('express')

const router = express.Router()

const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings
} = require('../controllers/bookingController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')

// User Routes
router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.put('/:id/cancel', protect, cancelBooking)

// Admin Route
router.get('/', protect, adminOnly, getAllBookings)

module.exports = router