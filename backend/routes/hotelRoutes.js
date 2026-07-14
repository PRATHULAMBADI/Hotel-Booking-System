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

const upload = require('../middleware/uploadMiddleware')

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createHotel )
router.put('/:id', protect, adminOnly, upload.single('image'), updateHotel)
router.delete('/:id', protect, adminOnly, deleteHotel)

// Public routes
router.get('/', getHotels)
router.get('/:id', getHotelById)

module.exports = router