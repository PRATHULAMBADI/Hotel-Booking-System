const Offer = require('../models/Offer')

exports.getOffers = async (req, res) => {
    try {

        const offers = await Offer.find().sort({
            createdAt: -1
        })

        res.json(offers)

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.getActiveOffers = async (req, res) => {
    try {

        const today = new Date()

        const offers = await Offer.find({
            status: 'Active',
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).sort({
            createdAt: -1
        })

        res.json(offers)

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.createOffer = async (req, res) => {
    try {

        const existingOffer = await Offer.findOne({
            couponCode: req.body.couponCode
        })

        if (existingOffer) {
            return res.status(400).json({
                success: false,
                message: 'Coupon Code Already Exists'
            })
        }

        const offer = await Offer.create(req.body)

        res.status(201).json({
            success: true,
            offer
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.updateOffer = async (req, res) => {
    try {

        const duplicate = await Offer.findOne({
            couponCode: req.body.couponCode,
            _id: { $ne: req.params.id }
        })

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: 'Coupon Code Already Exists'
            })
        }

        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer Not Found'
            })
        }

        res.json({
            success: true,
            offer
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.deleteOffer = async (req, res) => {
    try {

        const offer = await Offer.findByIdAndDelete(req.params.id)

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer Not Found'
            })
        }

        res.json({
            success: true,
            message: 'Offer Deleted Successfully'
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.validateCoupon = async (req, res) => {
    try {

        const { couponCode, amount } = req.body

        if (!couponCode) {
            return res.status(400).json({
                success: false,
                message: 'Coupon Code is Required'
            })
        }

        if (couponCode !== couponCode.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Coupon Code'
            })
        }

        if (/\s/.test(couponCode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Coupon Code'
            })
        }

        const offer = await Offer.findOne({
            couponCode: couponCode,
            status: 'Active'
        })

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Invalid Coupon Code'
            })
        }

        const today = new Date()

        if (today < offer.startDate) {
            return res.status(400).json({
                success: false,
                message: 'Coupon Not Active Yet'
            })
        }

        if (today > offer.endDate) {
            return res.status(400).json({
                success: false,
                message: 'Coupon Expired'
            })
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Booking Amount'
            })
        }

        const discountAmount = Number(
            ((amount * offer.discount) / 100).toFixed(2)
        )

        const finalAmount = Number(
            (amount - discountAmount).toFixed(2)
        )

        res.json({
            success: true,
            message: 'Coupon Applied Successfully',
            couponCode: offer.couponCode,
            discount: offer.discount,
            discountAmount,
            finalAmount
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

