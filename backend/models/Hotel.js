const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    amenities: [
        {
            type: String
        }
    ],

    rating: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Hotel', hotelSchema)