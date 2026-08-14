import { useEffect, useRef, useState } from 'react'
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

    const fileInputRef = useRef(null)
    const formSectionRef = useRef(null)

    useEffect(() => {
        fetchHotels()
    }, [])
    const fetchHotels = async () => {
        try {
            const response = await api.get('/hotels')
            setHotels(response.data.hotels)
        } catch (error) {
            console.log(
                'Error fetching hotels:',
                error
            )
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }))
    }
    const handleImageChange = (e) => {
        setFormData((previousData) => ({
            ...previousData,
            image: e.target.files[0] || null
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append(
                'name',
                formData.name
            )
            data.append(
                'location',
                formData.location
            )
            data.append(
                'description',
                formData.description
            )
            if (formData.image) {

                data.append(
                    'image',
                    formData.image
                )
            }

            if (editingId) {

                await api.put(
                    `/hotels/${editingId}`,
                    data
                )

                alert(
                    'Hotel updated successfully'
                )

            }

            else {
                await api.post(
                    '/hotels',
                    data
                )

                alert(
                    'Hotel added successfully'
                )
            }

            resetForm()

            await fetchHotels()

        } catch (error) {

            console.log(
                'Hotel save error:',
                error
            )

            alert(
                error.response?.data?.message ||
                'Something went wrong'
            )
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

        setTimeout(() => {

            formSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })

        }, 100)
    }

    const deleteHotel = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this hotel?'
        )

        if (!confirmDelete) {
            return
        }

        try {

            await api.delete(
                `/hotels/${id}`
            )

            alert(
                'Hotel deleted successfully'
            )

            await fetchHotels()

        } catch (error) {

            console.log(
                'Delete error:',
                error
            )

            alert(
                error.response?.data?.message ||
                'Failed to delete hotel'
            )
        }
    }

    const resetForm = () => {

        setFormData({
            name: '',
            location: '',
            description: '',
            image: null
        })

        setEditingId(null)

        if (fileInputRef.current) {

            fileInputRef.current.value = ''
        }
    }

    return (

        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Manage Hotels
            </h1>
            <div
                ref={formSectionRef}
                className="bg-white p-5 rounded-lg shadow mb-8 scroll-mt-6"
            >
                <h2 className="text-xl font-semibold mb-4">

                    {editingId
                        ? 'Update Hotel'
                        : 'Add Hotel'
                    }

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
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="4"
                        required
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >

                            {editingId
                                ? 'Update Hotel'
                                : 'Add Hotel'
                            }

                        </button>
                        {editingId && (

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
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
                        {hotels.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="p-5 text-center text-gray-500"
                                >
                                    No hotels found
                                </td>
                            </tr>
                        ) : (
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
                                            onClick={() =>
                                                editHotel(hotel)
                                            }
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteHotel(hotel._id)
                                            }
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageHotels

