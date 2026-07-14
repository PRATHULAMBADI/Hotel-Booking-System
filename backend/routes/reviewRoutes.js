const express = require('express')

const router = express.Router()

const {
    addReview,
    getHotelReviews,
    getAllReviews,
    deleteReview
} = require('../controllers/reviewController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')


router.post('/', protect, addReview)

router.get('/', protect, adminOnly, getAllReviews)

router.get('/:hotelId', getHotelReviews)

router.delete('/:id', protect, adminOnly, deleteReview)


module.exports = router