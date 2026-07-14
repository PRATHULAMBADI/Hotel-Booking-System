const Booking = require('../models/Booking')
const Room = require('../models/Room')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

// Create Booking
exports.createBooking = async (req, res) => {
    try {
        const {
            hotelId,
            roomId,
            checkIn,
            checkOut,
            guests
        } = req.body

        const room = await Room.findById(roomId)

        if (!room) {
            return res.status(404).json({
                message: 'Room not found'
            })
        }

        const existingBooking = await Booking.findOne({
            roomId,
            bookingStatus: 'Booked',
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
        })

        if (existingBooking) {
            return res.status(400).json({
                message: 'Room is already booked for selected dates'
            })
        }

        const totalDays = Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )

        const totalPrice = totalDays * room.price

        const booking = await Booking.create({
            userId: req.user.id,
            hotelId,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice
        })

        const user = await User.findById(req.user.id)

        if (user) {
            await sendEmail(
                user.email,
                'Booking Confirmed | Hotel Booking System',
                `
                <div style="max-width:600px;margin:auto;font-family:Arial;background:#ffffff;border:1px solid #ddd;border-radius:10px;overflow:hidden;">

                    <div style="background:#2563eb;color:white;padding:20px;text-align:center;">
                        <h2>Hotel Booking System</h2>
                        <p>Your reservation is confirmed</p>
                    </div>

                    <div style="padding:25px;">

                        <h3>Hello ${user.name},</h3>

                        <p>
                            Thank you for choosing Hotel Booking System.
                            Your booking has been confirmed successfully.
                        </p>

                        <h3>Booking Details</h3>

                        <table style="width:100%;border-collapse:collapse;">

                            <tr>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    Check In
                                </td>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    ${checkIn}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    Check Out
                                </td>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    ${checkOut}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    Guests
                                </td>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    ${guests}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px;border:1px solid #ddd;">
                                    Total Amount
                                </td>
                                <td style="padding:10px;border:1px solid #ddd;color:green;font-weight:bold;">
                                    ₹${totalPrice}
                                </td>
                            </tr>

                        </table>

                        <p style="margin-top:20px;">
                            Please carry a valid government ID during check-in.
                        </p>

                        <p>
                            We hope you have a comfortable stay.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>Hotel Booking System Team</strong>
                        </p>

                    </div>

                    <div style="background:#111827;color:white;text-align:center;padding:12px;">
                        © 2026 Hotel Booking System
                    </div>

                </div>
                `
            )
        }

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// Get Logged-in User Bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user.id
        })
            .populate('hotelId')
            .populate('roomId')

        res.status(200).json({
            count: bookings.length,
            bookings
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Unauthorized'
            })
        }

        booking.bookingStatus = 'Cancelled'

        await booking.save()

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('hotelId')
            .populate('roomId')

        res.status(200).json({
            count: bookings.length,
            bookings
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}