import { useEffect, useState } from 'react'
import api from '../services/api'

function MyBookings() {
    const [bookings, setBookings] = useState([])

    const getBookings = async () => {
        try {
            const token = sessionStorage.getItem('token')
            const response = await api.get('/bookings/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setBookings(response.data.bookings)
        } catch (error) {
            console.log(error.message)
        }
    }

    const cancelBooking = async (id) => {
        try {
            const token = sessionStorage.getItem('token')
            
            await api.put(
                `/bookings/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert('Booking cancelled')

            getBookings()
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        getBookings()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
                    My Bookings
                </h2>

                {
                    bookings.length === 0 ? (

                        <p className="text-center text-gray-500 text-lg">
                            No bookings found
                        </p>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {
                                bookings.map((booking) => (

                                    <div
                                        key={booking._id}
                                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                                    >

                                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                            {booking.hotelId?.name}
                                        </h3>

                                        <p className="text-gray-600 mb-2">
                                            Room: {booking.roomId?.roomType}
                                        </p>

                                        <p className="text-gray-600 mb-2">
                                            Check In: {new Date(booking.checkIn).toDateString()}
                                        </p>

                                        <p className="text-gray-600 mb-2">
                                            Check Out: {new Date(booking.checkOut).toDateString()}
                                        </p>

                                        <p className="text-green-600 font-semibold mb-2">
                                            Price: ₹{booking.totalPrice}
                                        </p>

                                        <p className="text-gray-600 mb-4">
                                            Status: {booking.bookingStatus}
                                        </p>

                                        {
                                            booking.bookingStatus === 'Booked' && (

                                                <button
                                                    onClick={() => cancelBooking(booking._id)}
                                                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Cancel Booking
                                                </button>

                                            )
                                        }

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>
        </div>
    )
}

export default MyBookings