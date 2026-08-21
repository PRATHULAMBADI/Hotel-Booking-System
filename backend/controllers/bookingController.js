const Booking = require('../models/Booking')
const Room = require('../models/Room')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

exports.createBooking = async (req, res) => {
    try {
        const {
            hotelId,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            couponCode,
            discount,
            orderId,
            paymentId
        } = req.body

        if (
            !hotelId ||
            !roomId ||
            !checkIn ||
            !checkOut ||
            !guests
        ) {
            return res.status(400).json({
                success: false,
                message: 'All booking details are required'
            })
        }

        if (!orderId || !paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment is required to create booking'
            })
        }

        const room = await Room.findById(roomId)

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            })
        }

        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: 'Check-out date must be after check-in date'
            })
        }

        const existingBooking = await Booking.findOne({
            roomId,
            bookingStatus: 'Booked',
            checkIn: {
                $lt: checkOutDate
            },
            checkOut: {
                $gt: checkInDate
            }
        })

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Room is already booked for selected dates'
            })
        }

        const totalDays = Math.ceil(
            (checkOutDate - checkInDate) /
            (1000 * 60 * 60 * 24)
        )

        const calculatedAmount = totalDays * room.price

        const finalAmount =
            totalPrice && totalPrice > 0
                ? totalPrice
                : calculatedAmount

        const booking = await Booking.create({
            userId: req.user.id,
            hotelId,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice: finalAmount,
            couponCode: couponCode || '',
            discount: discount || 0,
            orderId,
            paymentId,
            paymentStatus: 'Paid',
            bookingStatus: 'Booked'
        })

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        })

        const user = await User.findById(req.user.id)

        if (user) {
            sendEmail(
                user.email,
                'Booking Confirmed | Hotel Booking System',
                `
                <div style="max-width:600px;margin:auto;font-family:Arial;background:#ffffff;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
                    <div style="background:#2563eb;color:white;padding:20px;text-align:center;">
                        <h2>Hotel Booking System</h2>
                        <p>Your booking has been confirmed</p>
                    </div>

                    <div style="padding:25px;">
                        <h3>Hello ${user.name},</h3>

                        <p>
                            Thank you for choosing us.
                            Your room has been booked successfully.
                        </p>

                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Check In
                                </td>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    ${checkIn}
                                </td>
                            </tr>

                            <tr>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Check Out
                                </td>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    ${checkOut}
                                </td>
                            </tr>

                            <tr>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Guests
                                </td>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    ${guests}
                                </td>
                            </tr>

                            <tr>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Total Amount
                                </td>
                                <td style="border:1px solid #ddd;padding:10px;color:green;font-weight:bold;">
                                    ₹${finalAmount}
                                </td>
                            </tr>

                            <tr>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Payment Status
                                </td>
                                <td style="border:1px solid #ddd;padding:10px;">
                                    Paid
                                </td>
                            </tr>
                        </table>

                        <p style="margin-top:20px;">
                            Please carry a valid government ID during check-in.
                        </p>

                        <p>
                            Have a pleasant stay.
                        </p>
                    </div>
                </div>
                `
            ).catch(error => {
                console.log('Email sending failed:', error.message)
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getMyBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            userId: req.user.id
        })
            .populate('hotelId')
            .populate('roomId')

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

exports.cancelBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            })
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        if (booking.bookingStatus === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking already cancelled'
            })
        }

        booking.bookingStatus = 'Cancelled'

        await booking.save()

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}


exports.getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('hotelId')
            .populate('roomId')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}