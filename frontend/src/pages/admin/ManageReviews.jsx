import { useEffect, useState } from 'react'
import api from '../../services/api'

function ManageReviews() {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const response = await api.get('/reviews')
            setReviews(response.data.reviews)
        } catch(error) {
            console.log(error)
        }
}

    const deleteReview = async (id) => {
        try {
            await api.delete(`/reviews/${id}`)
            fetchReviews()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Manage Reviews
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                User
                            </th>

                            <th className="p-3 text-left">
                                Hotel
                            </th>

                            <th className="p-3 text-left">
                                Rating
                            </th>

                            <th className="p-3 text-left">
                                Comment
                            </th>

                            <th className="p-3 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            reviews.map((review) => (

                                <tr
                                    key={review._id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {review.userId?.name}
                                    </td>

                                    <td className="p-3">
                                        {review.hotelId?.name}
                                    </td>

                                    <td className="p-3">
                                        ⭐ {review.rating}
                                    </td>

                                    <td className="p-3">
                                        {review.comment}
                                    </td>

                                    <td className="p-3">

                                        <button
                                            onClick={() => deleteReview(review._id)}
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

export default ManageReviews