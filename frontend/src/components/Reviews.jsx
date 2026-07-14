import { useEffect, useState } from 'react'
import api from '../services/api'

function Reviews({ hotelId }) {
    const [reviews, setReviews] = useState([])

    const [formData, setFormData] = useState({
        rating: '',
        comment: ''
    })

    const getReviews = async () => {
        try {
            const response = await api.get(`/reviews/${hotelId}`)

            setReviews(response.data.reviews)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const addReview = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')

            await api.post(
                '/reviews',
                {
                    hotelId,
                    rating: formData.rating,
                    comment: formData.comment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert('Review added')

            setFormData({
                rating: '',
                comment: ''
            })

            getReviews()
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        getReviews()
    }, [])

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Reviews
            </h2>

            <div className="space-y-4 mb-8">

                {
                    reviews.length === 0 ? (

                        <p className="text-gray-500">
                            No reviews yet
                        </p>

                    ) : (

                        reviews.map((review) => (

                            <div 
                                key={review._id}
                                className="border rounded-lg p-4 bg-slate-50"
                            >

                                <h4 className="font-semibold text-slate-800">
                                    {review.userId.name}
                                </h4>

                                <p className="text-yellow-600 font-medium">
                                    Rating: {review.rating}/5
                                </p>

                                <p className="text-gray-600 mt-2">
                                    {review.comment}
                                </p>

                            </div>

                        ))

                    )
                }

            </div>


            <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Add Review
            </h3>


            <form onSubmit={addReview} className="space-y-4">

                <input
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    min="1"
                    max="5"
                    name="rating"
                    placeholder="Rating 1-5"
                    value={formData.rating}
                    onChange={handleChange}
                />


                <textarea
                    className="w-full px-4 py-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="comment"
                    placeholder="Write your review"
                    value={formData.comment}
                    onChange={handleChange}
                />


                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Submit Review
                </button>

            </form>

        </div>
    )
}

export default Reviews