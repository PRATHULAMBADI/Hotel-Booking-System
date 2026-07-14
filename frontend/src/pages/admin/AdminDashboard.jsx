import { useNavigate } from 'react-router-dom'

function AdminDashboard() {

    const navigate = useNavigate()

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <button
                    onClick={() => navigate('/admin/hotels')}
                    className="bg-blue-600 text-white p-5 rounded-lg"
                >
                    Manage Hotels
                </button>

                <button
                    onClick={() => navigate('/admin/rooms')}
                    className="bg-green-600 text-white p-5 rounded-lg"
                >
                    Manage Rooms
                </button>

                <button
                    onClick={() => navigate('/admin/bookings')}
                    className="bg-purple-600 text-white p-5 rounded-lg"
                >
                    Manage Bookings
                </button>

                <button
                    onClick={() => navigate('/admin/reviews')}
                    className="bg-yellow-600 text-white p-5 rounded-lg"
                >
                    Manage Reviews
                </button>

                <button
                    onClick={() => navigate('/admin/offers')}
                    className="bg-red-600 text-white p-5 rounded-lg"
                >
                    Manage Offers
                </button>

            </div>

        </div>
    )
}

export default AdminDashboard