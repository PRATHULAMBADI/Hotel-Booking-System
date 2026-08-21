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
    const backendUrl = 'https://hotel-booking-system-backend-bzcx.onrender.com'

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
        <div className='min-h-screen bg-slate-50 px-4 md:px-6 py-10'>
            <div className='max-w-6xl mx-auto'>

                <div className='text-center mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold text-emerald-800'>
                        Find Your Perfect Room
                    </h1>

                    <p className='text-emerald-500 mt-2'>
                        Search available rooms by location and stay dates
                    </p>
                </div>

                <form
                    onSubmit={searchRooms}
                    className='bg-white rounded-2xl shadow-md p-6 md:p-8 mb-10'
                >
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Location
                            </label>

                            <select
                                name='location'
                                value={searchData.location}
                                onChange={handleChange}
                                disabled={locationsLoading}
                                className='w-full px-4 py-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100'
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
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Check In
                            </label>

                            <input
                                type='date'
                                name='checkIn'
                                value={searchData.checkIn}
                                min={today}
                                onChange={handleChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Check Out
                            </label>

                            <input
                                type='date'
                                name='checkOut'
                                value={searchData.checkOut}
                                min={searchData.checkIn || today}
                                onChange={handleChange}
                                disabled={!searchData.checkIn}
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
                                required
                            />
                        </div>

                        <div className='flex items-end'>
                            <button
                                type='submit'
                                disabled={loading || locationsLoading}
                                className='w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Searching...' : 'Search Rooms'}
                            </button>
                        </div>

                    </div>
                </form>

                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className='text-2xl md:text-3xl font-bold text-slate-800'>
                            Available Rooms
                        </h2>

                        {rooms.length > 0 && (
                            <p className='text-gray-500 mt-1'>
                                {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                            </p>
                        )}
                    </div>
                </div>

                {rooms.length === 0 ? (
                    <div className='bg-white rounded-2xl shadow-md p-10 text-center'>
                        <div className='text-5xl mb-4'>
                            🏨
                        </div>

                        <h3 className='text-xl font-semibold text-slate-800'>
                            No rooms found
                        </h3>

                        <p className='text-gray-500 mt-2'>
                            Select a location and stay dates to find available rooms.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

                        {rooms.map(room => (
                            <div
                                key={room._id}
                                className='bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition'
                            >

                                <img
                                    src={
                                        room.images?.[0]
                                            ? `${backendUrl}${room.images[0]}`
                                            : 'https://placehold.co/600x400?text=No+Room+Image'
                                    }
                                    alt={room.roomType}
                                    className='w-full h-56 object-cover'
                                />

                                <div className='p-6'>

                                    <p className='text-sm text-green-600 font-medium mb-1'>
                                        {room.hotelId?.location || 'Hotel'}
                                    </p>

                                    <h3 className='text-xl font-bold text-slate-800 mb-2'>
                                        {room.hotelId?.name || 'Hotel'}
                                    </h3>

                                    <h4 className='text-lg font-semibold text-slate-700 mb-3'>
                                        {room.roomType}
                                    </h4>

                                    <p className='text-gray-600 text-sm line-clamp-3 mb-4'>
                                        {room.description || 'Comfortable room with modern facilities.'}
                                    </p>

                                    <div className='flex justify-between items-center mb-5'>

                                        <div>
                                            <p className='text-sm text-gray-500'>
                                                Price per night
                                            </p>

                                            <p className='text-xl font-bold text-green-600'>
                                                ₹{room.price}
                                            </p>
                                        </div>

                                        <div className='text-right'>
                                            <p className='text-sm text-gray-500'>
                                                Guests
                                            </p>

                                            <p className='font-semibold text-slate-700'>
                                                Up to {room.capacity}
                                            </p>
                                        </div>

                                    </div>

                                    <Link
                                        to={`/booking/${room._id}`}
                                        className='block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition'
                                    >
                                        Book Now
                                    </Link>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    )
}

export default SearchRooms