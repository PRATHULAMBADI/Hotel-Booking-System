import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import Reviews from '../components/Reviews'

function HotelDetails() {
    const { id } = useParams()

    const [hotel, setHotel] = useState(null)
    const [rooms, setRooms] = useState([])

    const getHotelDetails = async () => {
        try {
            const hotelResponse = await api.get(`/hotels/${id}`)
            setHotel(hotelResponse.data)

            const roomResponse = await api.get('/rooms')

            // const hotelRooms = roomResponse.data.rooms.filter(
            //     (room) => room.hotelId._id === id
            // )

            // setRooms(hotelRooms)

            const hotelRooms = roomResponse.data.rooms.filter(
    (room) => room.hotelId._id === id
)

hotelRooms.forEach((room) => {
    console.log(
        room.roomType,
        "=>",
        room.images
    )
})

setRooms(hotelRooms)

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getHotelDetails()
    }, [])

    if (!hotel) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <h2 className='text-2xl font-semibold'>
                    Loading...
                </h2>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-slate-100 py-10 px-6'>
            <div className='max-w-6xl mx-auto'>

                <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                    <img
                        src={
                            hotel.image
                                ? `https://hotel-booking-system-backend-bzcx.onrender.com${hotel.image}`
                                : 'https://placehold.co/600x400?text=No+Image'
                        }
                        alt={hotel.name}
                        className='w-full h-96 object-cover'
                    />
                    <div className='p-8'>
                        <h1 className='text-4xl font-bold text-slate-800'>
                            {hotel.name}
                        </h1>

                        <p className='text-gray-600 mt-3'>
                            📍 {hotel.location}
                        </p>

                        <p className='mt-6 text-gray-700 leading-7'>
                            {hotel.description}
                        </p>
                    </div>
                </div>

                <div className='mt-10'>
                    <h2 className='text-3xl font-bold mb-6'>
                        Available Rooms
                    </h2>

                    {rooms.length === 0 ? (
                        <div className='bg-white rounded-xl shadow p-6'>
                            <p>No rooms available.</p>
                        </div>
                    ) : (
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {rooms.map((room) => (
                                <div
                                    key={room._id}
                                    className='bg-white rounded-xl shadow-lg overflow-hidden'
                                >
                                    <img
                                                        
                                        src={
                                            room.images?.[0]
                                                ? `https://hotel-booking-system-backend-bzcx.onrender.com${room.images[0]}`
                                                : 'https://placehold.co/600x400?text=No+Image'
                                        }
                                        alt={room.roomType} 
                                        className='w-full h-56 object-cover rounded-lg mb-5' 
                                    />

                                    <div className='p-6'>
                                        <h3 className='text-2xl font-semibold mb-3'>
                                            {room.roomType}
                                        </h3>

                                        <p className='text-gray-600 mb-2'>
                                            Price: ₹{room.price} / night
                                        </p>

                                        <p className='text-gray-600 mb-4 line-clamp-3'>
                                            {room.description}
                                        </p>

                                        <Link to={`/booking/${room._id}`}>
                                            <button className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition'>
                                                Book Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='mt-12'>
                    <Reviews hotelId={hotel._id} />
                </div>

            </div>
        </div>
    )
}

export default HotelDetails
