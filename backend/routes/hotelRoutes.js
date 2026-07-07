const express = require('express')

const router = express.Router()

const {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require('../controllers/hotelController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')

// Admin routes
router.post('/', protect, adminOnly, createHotel)
router.put('/:id', protect, adminOnly, updateHotel)
router.delete('/:id', protect, adminOnly, deleteHotel)

// Public routes
router.get('/', getHotels)
router.get('/:id', getHotelById)

module.exports = router