import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    const token = sessionStorage.getItem('token')
    const user = JSON.parse(sessionStorage.getItem('user'))

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <nav className='sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm'>
            <div className='max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between'>
                <Link to='/' className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl shadow-sm'>
                        🏨
                    </div>
                    <span className='text-2xl font-bold tracking-tight text-slate-800'>
                        Stay<span className='text-emerald-600'>Ease</span>
                    </span>
                </Link>

                <div className='flex items-center gap-7'>
                    <Link
                        to='/'
                        className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                    >
                        Home
                    </Link>

                    <Link
                        to='/hotels'
                        className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                    >
                        Hotels
                    </Link>

                    {!token && (
                        <>
                            <Link
                                to='/search'
                                className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                            >
                                Search Rooms
                            </Link>

                            <Link
                                to='/login'
                                className='px-5 py-2.5 rounded-xl border border-emerald-200 text-emerald-600 font-medium hover:bg-emerald-50 transition-all duration-200'
                            >
                                Login
                            </Link>

                            <Link
                                to='/register'
                                className='px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all duration-200'
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {token && user?.role === 'user' && (
                        <>
                            <Link
                                to='/search'
                                className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                            >
                                Search Rooms
                            </Link>

                            <Link
                                to='/my-bookings'
                                className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                            >
                                My Bookings
                            </Link>

                            <Link
                                to='/profile'
                                className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className='px-5 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-200'
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {token && user?.role === 'admin' && (
                        <>
                            <Link
                                to='/admin/dashboard'
                                className='px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-all duration-200'
                            >
                                Dashboard
                            </Link>

                            <Link
                                to='/profile'
                                className='text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200'
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className='px-5 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-200'
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar