import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import backgroundImage from '../assets/bg.jpg'

function Home() {
    const navigate = useNavigate()
    const [offers, setOffers] = useState([])

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

    return (
        <div className='bg-slate-50'>
            <section
                className='relative min-h-[calc(100vh-80px)] bg-cover bg-center flex items-center'
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-black/30'></div>

                <div className='relative z-10 max-w-7xl mx-auto px-6 w-full'>
                    <div className='max-w-3xl'>
                        <span className='inline-flex items-center bg-emerald-600/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg'>
                            🏨 Premium Hotel Booking
                        </span>

                        <h1 className='text-5xl md:text-7xl font-extrabold text-white mt-8 leading-tight'>
                            Find Your Perfect
                            <br />
                            <span className='text-emerald-400'>
                                Stay With Ease.
                            </span>
                        </h1>

                        <p className='text-base md:text-xl text-slate-200 mt-8 max-w-2xl leading-8'>
                            Discover beautiful hotels, luxury resorts and unforgettable stays at the best prices.
                        </p>

                        <div className='mt-10 flex flex-wrap gap-4'>
                            <button
                                onClick={() => navigate('/search')}
                                className='inline-flex items-center gap-3 bg-emerald-600 text-white px-9 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-lg'
                            >
                                <span>🔍</span>
                                Search Hotels
                            </button>

                            <button
                                onClick={() => navigate('/hotels')}
                                className='inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white px-9 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-700 transition-all duration-300'
                            >
                                Explore Hotels
                            </button>
                        </div>
                    </div>
                </div>

                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm hidden md:block'>
                    Discover your next destination
                </div>
            </section>

            <section className='py-24 bg-slate-50'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center mb-14'>
                        <span className='text-emerald-600 font-semibold tracking-wider'>
                            SAVE MORE ON YOUR STAY
                        </span>

                        <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mt-3'>
                            Exclusive Offers
                        </h2>

                        <p className='text-slate-500 mt-4 text-lg max-w-2xl mx-auto'>
                            Enjoy special deals, seasonal discounts and exclusive offers on your next stay.
                        </p>
                    </div>

                    {offers.length === 0 ? (
                        <div className='text-center py-16 bg-white rounded-3xl border border-slate-200'>
                            <div className='text-5xl mb-4'>
                                🏨
                            </div>

                            <p className='text-slate-500 text-lg'>
                                No offers available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
                            {offers.map((offer) => (
                                <div
                                    key={offer._id}
                                    className='group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-slate-200'
                                >
                                    <div className='h-1.5 bg-gradient-to-r from-emerald-600 to-green-400'></div>

                                    <div className='p-7'>
                                        <div className='flex justify-between items-start gap-4'>
                                            <div>
                                                <span className='text-sm text-emerald-600 font-semibold'>
                                                    SPECIAL OFFER
                                                </span>

                                                <h3 className='text-2xl font-bold text-slate-900 mt-2'>
                                                    {offer.title}
                                                </h3>
                                            </div>

                                            <span className='bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-sm'>
                                                {offer.discount}% OFF
                                            </span>
                                        </div>

                                        <p className='text-slate-600 mt-5 leading-7'>
                                            {offer.description}
                                        </p>

                                        <div className='mt-7 bg-emerald-50 border border-emerald-100 rounded-2xl p-5'>
                                            <p className='text-xs text-slate-500 uppercase tracking-wider font-semibold'>
                                                Promo Code
                                            </p>

                                            <h4 className='text-2xl font-bold text-emerald-700 tracking-widest mt-1'>
                                                {offer.couponCode}
                                            </h4>
                                        </div>

                                        <div className='flex justify-between items-end mt-7'>
                                            <div>
                                                <p className='text-sm text-slate-500'>
                                                    Valid Till
                                                </p>

                                                <p className='font-semibold text-slate-800 mt-1'>
                                                    {new Date(offer.endDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => navigate('/search')}
                                                className='bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 hover:shadow-lg transition-all duration-300'
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className='py-20 bg-white border-t border-slate-200'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                        <div className='p-6'>
                            <div className='w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl'>
                                🏨
                            </div>

                            <h3 className='text-xl font-bold text-slate-900 mt-5'>
                                Premium Hotels
                            </h3>

                            <p className='text-slate-500 mt-2'>
                                Find comfortable and carefully selected hotels.
                            </p>
                        </div>

                        <div className='p-6'>
                            <div className='w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl'>
                                💰
                            </div>

                            <h3 className='text-xl font-bold text-slate-900 mt-5'>
                                Best Prices
                            </h3>

                            <p className='text-slate-500 mt-2'>
                                Get great deals and exclusive offers on your stay.
                            </p>
                        </div>

                        <div className='p-6'>
                            <div className='w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl'>
                                ⭐
                            </div>

                            <h3 className='text-xl font-bold text-slate-900 mt-5'>
                                Trusted Experience
                            </h3>

                            <p className='text-slate-500 mt-2'>
                                Enjoy a simple and reliable hotel booking experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home