const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dns = require('dns')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const hotelRoutes = require('./routes/hotelRoutes')
const roomRoutes = require('./routes/roomRoutes')

dns.setServers(['1.1.1.1', '8.8.8.8'])

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Hotel Booking API Running'
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/rooms', roomRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})