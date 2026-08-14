const express = require('express')

const router = express.Router()

const {
    getOffers,
    getActiveOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    validateCoupon
} = require('../controllers/offerController')

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware')

router.get(
    '/',
    getActiveOffers
)

router.post(
    '/validate',
    protect,
    validateCoupon
)

router.get(
    '/admin',
    protect,
    adminOnly,
    getOffers
)

router.post(
    '/',
    protect,
    adminOnly,
    createOffer
)

router.put(
    '/:id',
    protect,
    adminOnly,
    updateOffer
)

router.delete(
    '/:id',
    protect,
    adminOnly,
    deleteOffer
)

module.exports = router