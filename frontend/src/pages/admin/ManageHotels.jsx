import { useEffect, useState } from 'react'
import api from '../../services/api'

function ManageHotels() {

    const [hotels, setHotels] = useState([])

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        image: null
    })

    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchHotels()
    }, [])

    const fetchHotels = async () => {
        try {
            const response = await api.get('/hotels')
            setHotels(response.data.hotels)
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('location', formData.location)
            data.append('description', formData.description)
            if (formData.image) {
                data.append('image', formData.image)
            }
            if (editingId) {
                await api.put(`/hotels/${editingId}`, data)
            } else {
                await api.post('/hotels', data)
            }
            setFormData({
                name: '',
                location: '',
                description: '',
                image: null
            })
            setEditingId(null)
            fetchHotels()
        } catch (error) {
            console.log(error)
        }
    }
    const editHotel = (hotel) => {
        setEditingId(hotel._id)
        setFormData({
            name: hotel.name || '',
            location: hotel.location || '',
            description: hotel.description || '',
            image: null
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }
    const deleteHotel = async (id) => {
        try {
            await api.delete(`/hotels/${id}`)
            fetchHotels()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Manage Hotels
            </h1>
            <div className="bg-white p-5 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Update Hotel' : 'Add Hotel'}
                </h2>
                <form 
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Hotel Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                    <button className="bg-blue-600 text-white px-5 py-2 rounded">
                        {editingId ? 'Update Hotel' : 'Add Hotel'}
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">
                                Image
                            </th>
                            <th className="p-3 text-left">
                                Name
                            </th>
                            <th className="p-3 text-left">
                                Location
                            </th>
                            <th className="p-3 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            hotels.map((hotel) => (
                                <tr 
                                    key={hotel._id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        <img
                                            src={
                                                hotel.image
                                                    ? `http://localhost:5000${hotel.image}`
                                                    : 'https://placehold.co/150x100?text=No+Image'
                                            }
                                            alt={hotel.name}
                                            className="w-20 h-14 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3">
                                        {hotel.name}
                                    </td>
                                    <td className="p-3">
                                        {hotel.location}
                                    </td>
                                    <td className="p-3 space-x-3">
                                        <button
                                            onClick={() => editHotel(hotel)}
                                            className="bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHotel(hotel._id)}
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

export default ManageHotels