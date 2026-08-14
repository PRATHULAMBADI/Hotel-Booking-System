const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },

    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    guests: {
        type: Number,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    couponCode: {
        type: String,
        default: ''
    },

    orderId: {
        type: String,
        default: ''
    },

    paymentId: {
        type: String,
        default: ''
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },

    bookingStatus: {
        type: String,
        enum: ['Booked', 'Cancelled'],
        default: 'Booked'
    }

},
{
    timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)