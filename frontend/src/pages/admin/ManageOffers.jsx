import { useEffect, useState } from 'react'
import api from '../../services/api'

function ManageOffers() {
    const [offers, setOffers] = useState([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        status: 'Active'
    })

    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchOffers()
    }, [])

    const fetchOffers = async () => {
        try {
            const response = await api.get('/offers')
            setOffers(response.data)
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (editingId) {
                await api.put(`/offers/${editingId}`, formData)
            } else {
                await api.post('/offers', formData)
            }

            setFormData({
                title: '',
                description: '',
                discount: '',
                startDate: '',
                endDate: '',
                status: 'Active'
            })

            setEditingId(null)
            fetchOffers()

        } catch (error) {
            console.log(error)
        }
    }

    const editOffer = (offer) => {
        setEditingId(offer._id)

        setFormData({
            title: offer.title,
            description: offer.description,
            discount: offer.discount,
            startDate: offer.startDate?.slice(0, 10),
            endDate: offer.endDate?.slice(0, 10),
            status: offer.status
        })
    }

    const deleteOffer = async (id) => {
        try {
            await api.delete(`/offers/${id}`)
            fetchOffers()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Manage Offers
            </h1>

            <div className="bg-white p-5 rounded-lg shadow mb-8">

                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Update Offer' : 'Add Offer'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="title"
                        placeholder="Offer Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        name="description"
                        placeholder="Offer Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        name="discount"
                        placeholder="Discount %"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>
                    </select>

                    <button className="bg-blue-600 text-white px-5 py-2 rounded">
                        {editingId ? 'Update Offer' : 'Add Offer'}
                    </button>

                </form>

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Title
                            </th>

                            <th className="p-3 text-left">
                                Discount
                            </th>

                            <th className="p-3 text-left">
                                Valid Date
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            offers.map((offer) => (

                                <tr
                                    key={offer._id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {offer.title}
                                    </td>

                                    <td className="p-3">
                                        {offer.discount}%
                                    </td>

                                    <td className="p-3">
                                        {offer.startDate?.slice(0, 10)}
                                        <br />
                                        {offer.endDate?.slice(0, 10)}
                                    </td>

                                    <td className="p-3">
                                        {offer.status}
                                    </td>

                                    <td className="p-3 space-x-3">

                                        <button
                                            onClick={() => editOffer(offer)}
                                            className="bg-green-600 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteOffer(offer._id)}
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

export default ManageOffers