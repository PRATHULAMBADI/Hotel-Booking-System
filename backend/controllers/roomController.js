const Room = require('../models/Room')

// Create room
exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body)

        res.status(201).json({
            message: 'Room created successfully',
            room
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get all rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('hotelId')

        res.status(200).json({
            count: rooms.length,
            rooms
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get single room
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('hotelId')

        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }

        res.status(200).json(room)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Update room
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }

        res.status(200).json({
            message: 'Room updated successfully',
            room
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Delete room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id)

        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }

        res.status(200).json({
            message: 'Room deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}