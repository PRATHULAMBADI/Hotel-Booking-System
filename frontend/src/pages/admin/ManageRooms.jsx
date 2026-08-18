import { useEffect, useRef, useState } from 'react'
import api from '../../services/api'

function ManageRooms() {
    const [rooms, setRooms] = useState([])
    const [hotels, setHotels] = useState([])
    const [images, setImages] = useState([])
    const [editingId, setEditingId] = useState(null)
    const formRef = useRef(null)

    const [formData, setFormData] = useState({
        hotelId: '',
        roomType: '',
        price: '',
        capacity: '',
        description: '',
        amenities: '',
        availability: true
    })

    useEffect(() => {
        fetchRooms()
        fetchHotels()
    }, [])

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms')
            setRooms(response.data.rooms)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchHotels = async () => {
        try {
            const response = await api.get('/hotels')
            setHotels(response.data.hotels)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleImageChange = (e) => {
        setImages(e.target.files)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append('hotelId', formData.hotelId)
            data.append('roomType', formData.roomType)
            data.append('price', formData.price)
            data.append('capacity', formData.capacity)
            data.append('description', formData.description)
            data.append('availability', formData.availability)
            data.append('amenities', formData.amenities)

            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i])
            }

            if (editingId) {
                await api.put(`/rooms/${editingId}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                alert('Room updated successfully!')
            } else {
                await api.post('/rooms', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                alert('Room added successfully!')
            }

            setFormData({
                hotelId: '',
                roomType: '',
                price: '',
                capacity: '',
                description: '',
                amenities: '',
                availability: true
            })
            setImages([])
            setEditingId(null)
            fetchRooms()
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || 'Something went wrong')
        }
    }

    const editRoom = (room) => {
        setEditingId(room._id)
        setFormData({
            hotelId: room.hotelId?._id || '',
            roomType: room.roomType || '',
            price: room.price || '',
            capacity: room.capacity || '',
            description: room.description || '',
            amenities: room.amenities?.join(', ') || '',
            availability: room.availability
        })

        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }, 100)
    }

    const deleteRoom = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this room?')
        if (!confirmDelete) return

        try {
            await api.delete(`/rooms/${id}`)
            alert('Room deleted successfully!')
            fetchRooms()
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || 'Failed to delete room')
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({
            hotelId: '',
            roomType: '',
            price: '',
            capacity: '',
            description: '',
            amenities: '',
            availability: true
        })
        setImages([])
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold mb-6'>Manage Rooms</h1>

            <div ref={formRef} className='bg-white p-6 rounded-lg shadow mb-8'>
                <h2 className='text-xl font-semibold mb-4'>
                    {editingId ? 'Update Room' : 'Add Room'}
                </h2>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <select
                        name='hotelId'
                        value={formData.hotelId}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                        required
                    >
                        <option value=''>Select Hotel</option>
                        {hotels.map((hotel) => (
                            <option key={hotel._id} value={hotel._id}>
                                {hotel.name} - {hotel.location}
                            </option>
                        ))}
                    </select>

                    <input
                        type='text'
                        name='roomType'
                        placeholder='Room Type'
                        value={formData.roomType}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                        required
                    />

                    <input
                        type='number'
                        name='price'
                        placeholder='Price'
                        value={formData.price}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                        required
                    />

                    <input
                        type='number'
                        name='capacity'
                        placeholder='Room Capacity'
                        value={formData.capacity}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                        required
                    />

                    <textarea
                        name='description'
                        placeholder='Description'
                        value={formData.description}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                    />

                    <input
                        type='text'
                        name='amenities'
                        placeholder='Amenities (WiFi, AC, TV)'
                        value={formData.amenities}
                        onChange={handleChange}
                        className='w-full border p-2 rounded'
                    />

                    <input
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleImageChange}
                        className='w-full border p-2 rounded'
                    />

                    <div className='flex gap-3'>
                        <button
                            type='submit'
                            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded'
                        >
                            {editingId ? 'Update Room' : 'Add Room'}
                        </button>

                        {editingId && (
                            <button
                                type='button'
                                onClick={cancelEdit}
                                className='bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded'
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='p-3 text-left'>Image</th>
                            <th className='p-3 text-left'>Room</th>
                            <th className='p-3 text-left'>Hotel</th>
                            <th className='p-3 text-left'>Price</th>
                            <th className='p-3 text-left'>Capacity</th>
                            <th className='p-3 text-left'>Status</th>
                            <th className='p-3 text-left'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id} className='border-t'>
                                <td className='p-3'>
                                    {room.images?.length > 0 && (
                                        <img
                                            src={`https://hotel-booking-system-backend-bzcx.onrender.com${room.images[0]}`}
                                            alt={room.roomType}
                                            className='w-20 h-16 object-cover rounded'
                                        />
                                    )}
                                </td>

                                <td className='p-3'>{room.roomType}</td>
                                <td className='p-3'>{room.hotelId?.name}</td>
                                <td className='p-3'>₹{room.price}</td>
                                <td className='p-3'>{room.capacity}</td>
                                <td className='p-3'>
                                    {room.availability ? 'Available' : 'Not Available'}
                                </td>

                                <td className='p-3 space-x-2'>
                                    <button
                                        type='button'
                                        onClick={() => editRoom(room)}
                                        className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded'
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => deleteRoom(room._id)}
                                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded'
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageRooms