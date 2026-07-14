import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Bookings() {
    const { roomId } = useParams()
    const navigate = useNavigate()

    const [room, setRoom] = useState(null)

    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: ''
    })

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await api.get(`/rooms/${roomId}`)
                setRoom(response.data)
            } catch (error) {
                alert('Failed to load room details')
            }
        }

        fetchRoom()
    }, [roomId])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
            alert('Check-out date must be after check-in date')
            return
        }

        try {
            const token = localStorage.getItem('token')

            await api.post(
                '/bookings',
                {
                    hotelId: room.hotelId._id,
                    roomId: room._id,
                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,
                    guests: formData.guests
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert('Booking successful')
            navigate('/my-bookings')

        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed')
        }
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading room details...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
            <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md">

                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
                    Book Room
                </h2>

                <div className="mb-5">
                    <h3 className="text-lg font-semibold">
                        {room.hotelId.name}
                    </h3>

                    <p className="text-gray-600">
                        {room.roomType} - ₹{room.price}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-gray-700 mb-2">
                            Check In
                        </label>

                        <input
                            className="w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="date"
                            name="checkIn"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">
                            Check Out
                        </label>

                        <input
                            className="w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="date"
                            name="checkOut"
                            min={formData.checkIn || new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        className="w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        name="guests"
                        placeholder="Guests"
                        onChange={handleChange}
                        required
                    />

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Confirm Booking
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Bookings