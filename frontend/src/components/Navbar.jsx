import { Link } from 'react-router-dom'

function Navbar() {

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex flex-wrap items-center justify-center gap-6 border-b">
            
            <Link 
                to="/" 
                className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
                Home
            </Link>

            <Link 
                to="/hotels" 
                className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
                Hotels
            </Link>

            <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Login
            </Link>

            <Link 
                to="/register" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
                Register
            </Link>

            <Link 
                to="/my-bookings" 
                className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
                My Bookings
            </Link>

            <Link 
                to="/search" 
                className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
                Search Rooms
            </Link>

        </nav>
    )
}

export default Navbar