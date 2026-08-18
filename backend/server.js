const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dns = require('dns')

const connectDB = require('./config/db')

const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const hotelRoutes = require('./routes/hotelRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const adminRoutes = require('./routes/adminRoutes')
const offerRoutes = require('./routes/offerRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const imageRoutes = require('./routes/imageRoutes')

dns.setServers(['1.1.1.1', '8.8.8.8'])

connectDB()

const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://hotel-booking-system-stayease.netlify.app'
    ],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Hotel Booking API Running'
    })
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/images', imageRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    // console.log(process.env.EMAIL_USER)
    // console.log(process.env.EMAIL_PASSWORD)
    console.log(`Server running on PORT: ${PORT}`)
})