import { useEffect, useState } from 'react'
import api from '../../services/api'

function ManageBookings() {
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        fetchBookings()
    }, [])

   const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings')
            setBookings(response.data.bookings)
        } catch(error) {
            console.log(error)
        }
    }

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, {
                status
            })

            fetchBookings()

        } catch (error) {
            console.log(error)
        }
    }

    const deleteBooking = async (id) => {
        try {
            await api.delete(`/bookings/${id}`)
            fetchBookings()

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Manage Bookings
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                User
                            </th>

                            <th className="p-3 text-left">
                                Hotel
                            </th>

                            <th className="p-3 text-left">
                                Room
                            </th>

                            <th className="p-3 text-left">
                                Dates
                            </th>

                            <th className="p-3 text-left">
                                Price
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            bookings.map((booking) => (

                                <tr
                                    key={booking._id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {booking.userId?.name}
                                    </td>

                                    <td className="p-3">
                                        {booking.hotelId?.name}
                                    </td>

                                    <td className="p-3">
                                        {booking.roomId?.roomType}
                                    </td>

                                    <td className="p-3">

                                        {new Date(booking.checkIn).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                        <br />
                                        {new Date(booking.checkOut).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}

                                    </td>

                                    <td className="p-3">
                                        ₹{booking.totalPrice}
                                    </td>

                                    <td className="p-3">

                                        <select
                                            value={booking.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    booking._id,
                                                    e.target.value
                                                )
                                            }
                                            className="border p-1 rounded"
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Confirmed">
                                                Confirmed
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                        </select>

                                    </td>

                                    <td className="p-3">

                                        <button
                                            onClick={() => deleteBooking(booking._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default ManageBookings