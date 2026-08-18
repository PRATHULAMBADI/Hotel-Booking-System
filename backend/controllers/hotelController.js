const Hotel = require('../models/Hotel')
const {
    uploadImage,
    deleteImage
} = require('../utils/gridfs')

exports.createHotel = async (req, res) => {

    try {

        let image = ''

        if (req.file) {

            const imageId =
                await uploadImage(req.file)

            image =
                `/api/images/${imageId}`
        }

        const hotel = await Hotel.create({
            ...req.body,
            image
        })

        res.status(201).json({
            message: 'Hotel created successfully',
            hotel
        })

    } catch (error) {

        console.error(
            'Create hotel error:',
            error
        )

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

        const existingHotel =
            await Hotel.findById(req.params.id)

        if (!existingHotel) {

            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        const updateData = {
            ...req.body
        }

        if (req.file) {

            const imageId =
                await uploadImage(req.file)

            updateData.image =
                `/api/images/${imageId}`

            if (
                existingHotel.image &&
                existingHotel.image.includes('/api/images/')
            ) {

                const oldImageId =
                    existingHotel.image
                        .split('/')
                        .pop()

                await deleteImage(oldImageId)
            }
        }

        const hotel =
            await Hotel.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true
                }
            )

        res.status(200).json({
            message: 'Hotel updated successfully',
            hotel
        })

    } catch (error) {

        console.error(
            'Update hotel error:',
            error
        )

        res.status(500).json({
            message: error.message
        })
    }
}
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)

        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        if (
            hotel.image &&
            hotel.image.includes('/api/images/')
        ) {
            const imageId = hotel.image.split('/').pop()

            await deleteImage(imageId)
        }

        await Hotel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: 'Hotel deleted successfully'
        })
    } catch (error) {
        console.error(
            'Delete hotel error:',
            error
        )

        res.status(500).json({
            message: error.message
        })
    }
}