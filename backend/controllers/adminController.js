const User = require('../models/User')
const Hotel = require('../models/Hotel')
const Room = require('../models/Room')
const Booking = require('../models/Booking')

exports.getDashboard = async (req,res)=>{
    try {

        const users = await User.countDocuments()
        const hotels = await Hotel.countDocuments()
        const rooms = await Room.countDocuments()
        const bookings = await Booking.countDocuments()
        const revenue = await Booking.aggregate([
            {
                $group:{
                    _id:null,
                    total:{
                        $sum:'$totalPrice'
                    }
                }
            }
        ])

        res.json({
            users,
            hotels,
            rooms,
            bookings,
            revenue: revenue[0]?.total || 0
        })

    } catch(error){

        res.status(500).json({
            message:error.message
        })

    }
}