import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function SearchRooms() {
    const [searchData, setSearchData] = useState({
        location: '',
        checkIn: '',
        checkOut: ''
    })

    const [locations, setLocations] = useState([])
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(false)
    const [locationsLoading, setLocationsLoading] = useState(true)

    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        fetchLocations()
    }, [])

    const fetchLocations = async () => {
        try {
            setLocationsLoading(true)

            const response = await api.get('/hotels')
            const hotels = response.data.hotels || response.data

            const uniqueLocations = [
                ...new Set(
                    hotels
                        .map(hotel => hotel.location)
                        .filter(Boolean)
                        .map(location => location.trim())
                )
            ].sort()

            setLocations(uniqueLocations)
        } catch (error) {
            console.log(error)
            setLocations([])
        } finally {
            setLocationsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setSearchData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'checkIn' && {
                checkOut: ''
            })
        }))
    }

    const searchRooms = async (e) => {
        e.preventDefault()

        const { location, checkIn, checkOut } = searchData

        if (!location || !checkIn || !checkOut) {
            alert('Please fill all search fields')
            return
        }

        if (new Date(checkIn) < new Date(today)) {
            alert('Check-in date cannot be before today')
            return
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            alert('Check-out date must be after check-in date')
            return
        }

        try {
            setLoading(true)

            const response = await api.get('/rooms/search', {
                params: {
                    location,
                    checkIn,
                    checkOut
                }
            })

            setRooms(response.data.rooms || [])

            if (response.data.count === 0) {
                alert(
                    response.data.message ||
                    'No rooms available for the selected dates'
                )
            }
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
        <div className='min-h-screen bg-slate-50 px-6 py-10'>
            <div className='max-w-5xl mx-auto'>
                <h2 className='text-3xl font-bold text-slate-800 text-center mb-8'>
                    Search Available Rooms
                </h2>

                <form
                    onSubmit={searchRooms}
                    className='bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 mb-10'
                >
                    <div className='relative'>
                        <select
                            name='location'
                            value={searchData.location}
                            onChange={handleChange}
                            disabled={locationsLoading}
                            className='w-full appearance-none px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
                            required
                        >
                            <option value=''>
                                {locationsLoading
                                    ? 'Loading locations...'
                                    : 'Select Location'}
                            </option>

                            {locations.map(location => (
                                <option
                                    key={location}
                                    value={location}
                                >
                                    {location}
                                </option>
                            ))}
                        </select>

                        <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>
                            ▼
                        </span>
                    </div>

                    <input
                        className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type='date'
                        name='checkIn'
                        value={searchData.checkIn}
                        min={today}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
                        type='date'
                        name='checkOut'
                        value={searchData.checkOut}
                        min={searchData.checkIn || today}
                        onChange={handleChange}
                        disabled={!searchData.checkIn}
                        required
                    />

                    <button
                        type='submit'
                        disabled={loading || locationsLoading}
                        className='bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <h2 className='text-3xl font-bold text-slate-800 mb-6'>
                    Available Rooms
                </h2>

                {rooms.length === 0 ? (
                    <p className='text-gray-500'>
                        No hotels found in this location
                    </p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {rooms.map(room => (
                            <div
                                key={room._id}
                                className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition'
                            >
                                <h3 className='text-xl font-semibold text-slate-800 mb-3'>
                                    {room.hotelId.name}
                                </h3>

                                <p className='text-gray-600 mb-2'>
                                    Room Type: {room.roomType}
                                </p>

                                <p className='text-green-600 font-semibold mb-2'>
                                    Price: ₹{room.price}
                                </p>

                                <p className='text-gray-600 mb-4'>
                                    Capacity: {room.capacity}
                                </p>

                                <Link
                                    to={`/booking/${room._id}`}
                                    className='inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition'
                                >
                                    Book Now
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchRooms