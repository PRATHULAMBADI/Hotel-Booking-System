import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
    const navigate = useNavigate()

    const cards = [
        {
            title: 'Manage Hotels',
            description: 'Add, update and manage your hotel properties.',
            path: '/admin/hotels',
            color: 'bg-emerald-100 text-emerald-600',
            icon: 'hotel'
        },
        {
            title: 'Manage Rooms',
            description: 'Manage room details, pricing and availability.',
            path: '/admin/rooms',
            color: 'bg-blue-100 text-blue-600',
            icon: 'room'
        },
        {
            title: 'Manage Bookings',
            description: 'View and manage all hotel bookings and reservations.',
            path: '/admin/bookings',
            color: 'bg-purple-100 text-purple-600',
            icon: 'booking'
        },
        {
            title: 'Manage Reviews',
            description: 'View and respond to guest reviews and ratings.',
            path: '/admin/reviews',
            color: 'bg-orange-100 text-orange-500',
            icon: 'review'
        },
        {
            title: 'Manage Offers',
            description: 'Create and manage exciting offers and discounts.',
            path: '/admin/offers',
            color: 'bg-pink-100 text-pink-600',
            icon: 'offer'
        }
    ]

    const Icon = ({ type }) => {
        if (type === 'hotel') {
            return (
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21h18M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16M16 8h3a2 2 0 012 2v11M9 7h2M9 11h2M9 15h2' />
                </svg>
            )
        }

        if (type === 'room') {
            return (
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M5 10V7a2 2 0 012-2h4a2 2 0 012 2v3M3 21v-3M21 21v-3' />
                </svg>
            )
        }

        if (type === 'booking') {
            return (
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <rect x='3' y='4' width='18' height='17' rx='2' strokeWidth='2' />
                    <path strokeLinecap='round' strokeWidth='2' d='M16 2v4M8 2v4M3 10h18' />
                </svg>
            )
        }

        if (type === 'review') {
            return (
                <svg className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
            )
        }

        return (
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 12l-8-8-8 8 8 8 8-8z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16' />
            </svg>
        )
    }

    return (
        <div className='min-h-screen bg-slate-50'>
            <main className='max-w-7xl mx-auto px-6 py-10'>
                <section className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-100 px-7 py-8 lg:px-10 lg:py-9 mb-8'>
                    <div className='relative z-10 flex items-center justify-between gap-6'>
                        <div>
                            <p className='text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2'>
                                Admin Dashboard
                            </p>
                            <h1 className='text-3xl lg:text-4xl font-bold text-emerald-950'>
                                Welcome back, Admin! 👋
                            </h1>
                            <p className='text-slate-600 mt-2'>
                                Manage your hotels, rooms, bookings, reviews and offers.
                            </p>
                        </div>
                        <div className='bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-emerald-100'>
                            <div className='w-11 h-11 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-950 font-bold'>
                                A
                            </div>
                            <div>
                                <p className='font-semibold text-slate-900'>
                                    Admin
                                </p>
                                <p className='text-xs text-slate-500'>
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='absolute -right-10 -bottom-20 w-80 h-80 bg-emerald-200/50 rounded-full' />
                    <div className='absolute right-20 -bottom-10 w-40 h-40 bg-green-300/40 rounded-full' />
                </section>

                <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {cards.map((card) => (
                        <button
                            key={card.title}
                            onClick={() => navigate(card.path)}
                            className='group bg-white rounded-2xl border border-slate-200 p-7 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                        >
                            <div className='flex items-start justify-between'>
                                <div className={`w-16 h-16 rounded-full ${card.color} flex items-center justify-center`}>
                                    <Icon type={card.icon} />
                                </div>
                                <div className='w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-500 transition-all duration-300'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 12h14M13 6l6 6-6 6' />
                                    </svg>
                                </div>
                            </div>
                            <h2 className='mt-6 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition'>
                                {card.title}
                            </h2>
                            <p className='mt-2 text-sm leading-6 text-slate-500 max-w-sm'>
                                {card.description}
                            </p>
                        </button>
                    ))}
                </section>
            </main>

            <footer className='border-t border-slate-200 bg-white px-6 lg:px-10 py-6 text-center text-sm text-slate-500'>
                © 2025 StayEase. All rights reserved.
            </footer>
        </div>
    )
}

export default AdminDashboard