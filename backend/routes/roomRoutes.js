const express = require('express')

const router = express.Router()

const upload = require('../middleware/uploadMiddleware')

const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    searchRooms
} = require('../controllers/roomController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), createRoom)
router.put('/:id', protect, adminOnly,upload.array('images', 5), updateRoom)
router.delete('/:id', protect, adminOnly, deleteRoom)

// Public routes
router.get('/', getRooms)
router.get('/search', searchRooms)
router.get('/:id', getRoomById)

module.exports = router