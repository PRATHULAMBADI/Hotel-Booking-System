const Hotel = require('../models/Hotel')

// Create hotel
exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body)

        res.status(201).json({
            message: 'Hotel created successfully',
            hotel
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get all hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find()

        res.status(200).json({
            count: hotels.length,
            hotels
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get single hotel
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)

        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        res.status(200).json(hotel)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Update hotel
exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        res.status(200).json({
            message: 'Hotel updated successfully',
            hotel
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Delete hotel
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id)

        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        res.status(200).json({
            message: 'Hotel deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}