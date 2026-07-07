const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    amenities: [
        {
            type: String
        }
    ],
    availability: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Room', roomSchema)