const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            default: 'Active'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Offer', offerSchema)