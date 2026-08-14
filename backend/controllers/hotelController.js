const Hotel = require('../models/Hotel')

exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create({
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        })

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

exports.updateHotel = async (req, res) => {
    try {

        const updateData = {
            ...req.body
        }

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`
        }

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: 'after'
            }
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

        console.error(error)

        res.status(500).json({
            message: error.message
        })
    }
}

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