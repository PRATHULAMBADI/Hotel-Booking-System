import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import Reviews from '../components/Reviews'

function HotelDetails() {
    const { id } = useParams()
    const [hotel, setHotel] = useState(null)
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    const getHotelDetails = async () => {
        try {
            setLoading(true)

            const hotelResponse = await api.get(`/hotels/${id}`)
            const roomResponse = await api.get('/rooms')

            setHotel(hotelResponse.data)

            const hotelRooms = roomResponse.data.rooms.filter(
                room => room.hotelId?._id === id
            )

            setRooms(hotelRooms)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getHotelDetails()
    }, [id])

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600 font-medium'>
                        Loading hotel...
                    </p>
                </div>
            </div>
        )
    }

    if (!hotel) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                        Hotel not found
                    </h2>

                    <Link
                        to='/hotels'
                        className='inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700'
                    >
                        Back to Hotels
                    </Link>
                </div>
            </div>
        )
    }

    const imageUrl = hotel.image
        ? `https://hotel-booking-system-backend-bzcx.onrender.com${hotel.image}`
        : 'https://placehold.co/1200x600?text=No+Hotel+Image'

    return (
        <div className='min-h-screen bg-slate-50 py-8 px-4'>
            <div className='max-w-6xl mx-auto'>

                <Link
                    to='/hotels'
                    className='inline-flex items-center gap-2 text-green-700 font-medium mb-5 hover:text-green-900'
                >
                    ← Back to Hotels
                </Link>

                <div className='bg-white rounded-2xl shadow-md overflow-hidden mb-10'>

                    <div className='relative'>
                        <img
                            src={imageUrl}
                            alt={hotel.name}
                            className='w-full h-[420px] object-cover'
                        />

                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent'></div>

                        <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                            <p className='text-sm font-medium mb-2 opacity-90'>
                                HOTEL
                            </p>

                            <h1 className='text-4xl md:text-5xl font-bold'>
                                {hotel.name}
                            </h1>

                            <p className='mt-3 text-lg'>
                                📍 {hotel.location}
                            </p>
                        </div>
                    </div>

                    <div className='p-8'>
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>

                            <div>
                                <h2 className='text-2xl font-bold text-slate-800'>
                                    About this hotel
                                </h2>

                                <p className='text-gray-600 mt-2 leading-7'>
                                    {hotel.description}
                                </p>
                            </div>

                            <div className='bg-green-50 border border-green-100 rounded-xl px-5 py-4 min-w-[180px]'>
                                <p className='text-sm text-gray-500'>
                                    Available Rooms
                                </p>

                                <p className='text-3xl font-bold text-green-700'>
                                    {rooms.length}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='mb-12'>

                    <div className='flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-2'>
                        <div>
                            <h2 className='text-3xl font-bold text-slate-800'>
                                Choose Your Room
                            </h2>

                            <p className='text-gray-500 mt-1'>
                                Select a room that suits your stay
                            </p>
                        </div>

                        <span className='text-sm text-gray-500'>
                            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                        </span>
                    </div>

                    {rooms.length === 0 ? (

                        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center'>
                            <div className='text-5xl mb-4'>
                                🛏️
                            </div>

                            <h3 className='text-xl font-semibold text-gray-800'>
                                No rooms available
                            </h3>

                            <p className='text-gray-500 mt-2'>
                                Please check another hotel.
                            </p>
                        </div>

                    ) : (

                        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>

                            {rooms.map(room => {

                                const roomImage = room.images?.[0]
                                    ? `https://hotel-booking-system-backend-bzcx.onrender.com${room.images[0]}`
                                    : 'https://placehold.co/600x400?text=No+Room+Image'

                                return (
                                    <div
                                        key={room._id}
                                        className='bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-100'
                                    >

                                        <div className='relative'>
                                            <img
                                                src={roomImage}
                                                alt={room.roomType}
                                                className='w-full h-56 object-cover'
                                            />

                                            <div className='absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-green-700 shadow'>
                                                ₹{room.price}/night
                                            </div>
                                        </div>

                                        <div className='p-6'>

                                            <h3 className='text-xl font-bold text-slate-800'>
                                                {room.roomType}
                                            </h3>

                                            <div className='flex gap-4 mt-3 text-sm text-gray-500'>
                                                <span>
                                                    👤 {room.capacity} Guests
                                                </span>

                                                <span>
                                                    🛏️ Room
                                                </span>
                                            </div>

                                            <p className='text-gray-600 mt-4 leading-6 line-clamp-3 min-h-[72px]'>
                                                {room.description || 'Comfortable room with modern facilities.'}
                                            </p>

                                            <Link
                                                to={`/booking/${room._id}`}
                                                className='block mt-5'
                                            >
                                                <button className='w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition'>
                                                    Book This Room
                                                </button>
                                            </Link>

                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    )}

                </div>

                <div className='bg-white rounded-2xl shadow-md p-6 md:p-8'>
                    <Reviews hotelId={hotel._id} />
                </div>

            </div>
        </div>
    )
}

export default HotelDetails