const Razorpay = require('razorpay')
// console.log(process.env.VITE_RAZORPAY_KEY_ID)
// console.log(process.env.RAZORPAY_KEY_SECRET)
const razorpay = new Razorpay({
    
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

module.exports = razorpay