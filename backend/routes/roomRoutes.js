const express = require('express')

const router = express.Router()

const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')

// Admin routes
router.post('/', protect, adminOnly, createRoom)
router.put('/:id', protect, adminOnly, updateRoom)
router.delete('/:id', protect, adminOnly, deleteRoom)

// Public routes
router.get('/', getRooms)
router.get('/:id', getRoomById)

module.exports = router