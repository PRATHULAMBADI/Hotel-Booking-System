const Room = require('../models/Room')
const Hotel = require('../models/Hotel')
const Booking = require('../models/Booking')

const {
    uploadImage,
    deleteImage
} = require('../utils/gridfs')

exports.createRoom = async (req, res) => {

    try {

        const images = []

        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const imageId =
                    await uploadImage(file)

                images.push(
                    `/api/images/${imageId}`
                )
            }
        }

        const room = await Room.create({
            ...req.body,
            images
        })

        res.status(201).json({
            message: 'Room created successfully',
            room
        })

    } catch (error) {

        console.error(
            'Create room error:',
            error
        )

        res.status(500).json({
            message: error.message
        })
    }
}

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

exports.updateRoom = async (req, res) => {

    try {

        const existingRoom =
            await Room.findById(req.params.id)

        if (!existingRoom) {

            return res.status(404).json({
                message: 'Room not found'
            })
        }

        const updateData = {
            ...req.body
        }

        if (req.files && req.files.length > 0) {

            const newImages = []

            for (const file of req.files) {

                const imageId =
                    await uploadImage(file)

                newImages.push(
                    `/api/images/${imageId}`
                )
            }

            updateData.images = newImages

            // Delete previous GridFS images
            if (existingRoom.images) {

                for (
                    const image of existingRoom.images
                ) {

                    if (
                        image.includes('/api/images/')
                    ) {

                        const oldImageId =
                            image.split('/').pop()

                        await deleteImage(
                            oldImageId
                        )
                    }
                }
            }
        }

        const room =
            await Room.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true
                }
            )

        res.status(200).json({
            message: 'Room updated successfully',
            room
        })

    } catch (error) {

        console.error(
            'Update room error:',
            error
        )

        res.status(500).json({
            message: error.message
        })
    }
}
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

exports.searchRooms = async (req, res) => {
    try {
        const { location, checkIn, checkOut } = req.query

        if (!location || !checkIn || !checkOut) {
            return res.status(400).json({
                message: 'Location, checkIn and checkOut are required'
            })
        }

        const hotels = await Hotel.find({
            location: { $regex: location, $options: 'i' }
        })

        if (hotels.length === 0) {
            return res.status(200).json({
                count: 0,
                rooms: [],
                message: 'No hotels found in this location'
            })
        }

        const hotelIds = hotels.map(hotel => hotel._id)

        const rooms = await Room.find({
            hotelId: { $in: hotelIds }
        }).populate('hotelId')

        const availableRooms = []

        for (const room of rooms) {

            const booking = await Booking.findOne({
                roomId: room._id,
                bookingStatus: 'Booked',
                checkIn: { $lt: new Date(checkOut) },
                checkOut: { $gt: new Date(checkIn) }
            })

            if (!booking) {
                availableRooms.push(room)
            }
        }

        res.status(200).json({
            count: availableRooms.length,
            rooms: availableRooms,
            message:
                availableRooms.length === 0
                    ? 'No rooms available for the selected dates'
                    : 'Rooms found successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}