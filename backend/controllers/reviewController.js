const Review = require('../models/Review')
const Hotel = require('../models/Hotel')

// Add Review
exports.addReview = async (req, res) => {
    try {
        const { hotelId, rating, comment } = req.body

        const hotel = await Hotel.findById(hotelId)

        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found'
            })
        }

        const review = await Review.create({
            userId: req.user.id,
            hotelId,
            rating,
            comment
        })

        res.status(201).json({
            message: 'Review added successfully',
            review
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get Reviews by Hotel
exports.getHotelReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            hotelId: req.params.hotelId
        }).populate('userId', 'name')

        res.status(200).json({
            count: reviews.length,
            reviews
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            })
        }

        if (
            review.userId.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'Unauthorized'
            })
        }

        await Review.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: 'Review deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Get All Reviews (Admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'name')
            .populate('hotelId', 'name')
        res.status(200).json({
            count: reviews.length,
            reviews
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}