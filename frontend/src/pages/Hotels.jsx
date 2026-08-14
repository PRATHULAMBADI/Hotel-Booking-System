import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Hotels() {

const [hotels, setHotels] = useState([])
const getHotels = async () => {
    try {
        const response = await api.get('/hotels')
        setHotels(response.data.hotels)
    } catch (error) {
        console.log(error.message)
    }
}
useEffect(() => {
    getHotels()
}, [])

return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
        <h2 className="text-3xl font-bold text-emerald-700 text-center mb-8">
            Available Hotels
        </h2>
        {
            hotels.length === 0 ? (
                <p className="text-center text-emerald-500 text-lg">
                    No hotels available
                </p>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        hotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition'
                            >

                                <img
                                    src={
                                        hotel.image
                                            ? `http://localhost:5000${hotel.image}`
                                            : 'https://placehold.co/600x400?text=No+Image'
                                    }
                                    alt={hotel.name}
                                    className='w-full h-56 object-cover'
                                />

                                <div className='p-6'>

                                    <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                                        {hotel.name}
                                    </h3>

                                    <p className='text-emerald-400 font-medium mb-3'>
                                        Location: {hotel.location}
                                    </p>

                                    <p className='text-gray-600 mb-5 line-clamp-3'>
                                        {hotel.description}
                                    </p>

                                    <Link
                                        to={`/hotel/${hotel._id}`}
                                        className='inline-block border-2 border-emerald-500  text-emerald-500 px-5 py-2 rounded-lg hover:bg-emerald-200 hover:text-white transition'
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }
    </div>
)
}

export default Hotels