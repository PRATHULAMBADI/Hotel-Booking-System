const crypto = require('crypto')
const razorpay = require('../config/razorpay')

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment amount'
            })
        }

        const options = {
            amount: Number(amount) * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        })
    }
}

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: 'Payment details are missing'
            })
        }

        const generatedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            }
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        })
    }
}