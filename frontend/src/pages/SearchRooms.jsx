import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function SearchRooms() {
    const [searchData, setSearchData] = useState({
        location: '',
        checkIn: '',
        checkOut: ''
    })

    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        })
    }

    const searchRooms = async (e) => {
        e.preventDefault()

        if (!searchData.location || !searchData.checkIn || !searchData.checkOut) {
            alert('Please fill all search fields')
            return
        }

        try {
            setLoading(true)

            const response = await api.get('/rooms/search', {
                params: searchData
            })

            setRooms(response.data.rooms)

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed to search rooms'
            )

            setRooms([])

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
                    Search Available Rooms
                </h2>

                <form
                    onSubmit={searchRooms}
                    className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
                >

                    <input
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="location"
                        placeholder="Location"
                        value={searchData.location}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="date"
                        name="checkIn"
                        value={searchData.checkIn}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="date"
                        name="checkOut"
                        value={searchData.checkOut}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>

                </form>

                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                    Available Rooms
                </h2>

                {
                    rooms.length === 0 ? (
                        <p className="text-gray-500">
                            No rooms available
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {
                                rooms.map((room) => (
                                    <div
                                        key={room._id}
                                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                                    >

                                        <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                            {room.hotelId.name}
                                        </h3>

                                        <p className="text-gray-600 mb-2">
                                            Room Type: {room.roomType}
                                        </p>

                                        <p className="text-green-600 font-semibold mb-2">
                                            Price: ₹{room.price}
                                        </p>

                                        <p className="text-gray-600 mb-4">
                                            Capacity: {room.capacity}
                                        </p>

                                        <Link
                                            to={`/booking/${room._id}`}
                                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Book Now
                                        </Link>

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

export default SearchRooms
