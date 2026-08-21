import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../services/api'

function Bookings() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const token = sessionStorage.getItem('token')

    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)
    const [room, setRoom] = useState(null)

    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        couponCode: location.state?.couponCode || ''
    })

    const [priceDetails, setPriceDetails] = useState({
        totalDays: 0,
        roomPrice: 0,
        originalPrice: 0,
        discount: 0,
        discountAmount: 0,
        finalAmount: 0
    })

    useEffect(() => {
        fetchRoom()
    }, [roomId])

   useEffect(() => {
        calculatePrice()

        setPriceDetails(prev => ({
            ...prev,
            discount: 0,
            discountAmount: 0
        }))
    }, [formData.checkIn, formData.checkOut])

    const fetchRoom = async () => {
        try {
            setLoading(true)

            const response = await api.get(`/rooms/${roomId}`)

            setRoom(response.data)
        } catch (error) {
            console.log(error)
            alert('Failed to load room')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const calculatePrice = () => {
        if (!room) return

        if (!formData.checkIn || !formData.checkOut) {
            setPriceDetails({
                totalDays: 0,
                roomPrice: room.price,
                originalPrice: 0,
                discount: 0,
                discountAmount: 0,
                finalAmount: 0
            })
            return
        }

        const checkIn = new Date(formData.checkIn)
        const checkOut = new Date(formData.checkOut)

        if (checkOut <= checkIn) {
            setPriceDetails({
                totalDays: 0,
                roomPrice: room.price,
                originalPrice: 0,
                discount: 0,
                discountAmount: 0,
                finalAmount: 0
            })
            return
        }

        const days = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        )

        const amount = days * room.price

        setPriceDetails({
            totalDays: days,
            roomPrice: room.price,
            originalPrice: amount,
            discount: 0,
            discountAmount: 0,
            finalAmount: amount
        })
    }

    const applyCoupon = async () => {
        if (!formData.couponCode) {
            alert('Enter coupon code')
            return
        }

        if (priceDetails.originalPrice <= 0) {
            alert('Select check-in and check-out dates first')
            return
        }

        try {
            const response = await api.post(
                '/offers/validate',
                {
                    couponCode: formData.couponCode,
                    amount: priceDetails.originalPrice
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setPriceDetails(prev => ({
                ...prev,
                discount: response.data.discount,
                discountAmount: response.data.discountAmount,
                finalAmount: response.data.finalAmount
            }))

            alert('Coupon Applied Successfully')
        } catch (error) {
            console.log(error)

            alert(
                error.response?.data?.message ||
                'Invalid Coupon'
            )
        }
    }

    const createOrder = async () => {
        const response = await api.post(
            '/payments/create-order',
            {
                amount: priceDetails.finalAmount
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data.order
    }

    const verifyPayment = async (payment) => {
        const response = await api.post(
            '/payments/verify',
            {
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data.success
    }

    const createBooking = async (payment) => {
        const response = await api.post(
            '/bookings',
            {
                hotelId: room.hotelId._id,
                roomId: room._id,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: Number(formData.guests),
                couponCode: formData.couponCode,
                discount: priceDetails.discountAmount,
                totalPrice: priceDetails.finalAmount,
                orderId: payment.razorpay_order_id,
                paymentId: payment.razorpay_payment_id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data
    }

    const handlePayment = async (e) => {
        e.preventDefault()

        if (!token) {
            alert('Please login first')
            navigate('/login')
            return
        }

        if (!formData.checkIn || !formData.checkOut || !formData.guests) {
            alert('Fill all fields')
            return
        }

        if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
            alert('Invalid dates')
            return
        }

        if (priceDetails.finalAmount <= 0) {
            alert('Invalid payment amount')
            return
        }

        if (!room) {
            alert('Room details are not available')
            return
        }

        try {
            setPaying(true)

            const order = await createOrder()

            if (!order || !order.id) {
                throw new Error('Razorpay order was not created')
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Hotel Booking System',
                description: 'Room Booking',
                order_id: order.id,

                handler: async function(payment) {
                    try {
                        const verified = await verifyPayment(payment)

                        if (!verified) {
                            alert('Payment Verification Failed')
                            setPaying(false)
                            return
                        }

                        await createBooking(payment)

                        alert('Booking Successful')

                        navigate('/my-bookings')
                    } catch (error) {
                        console.log(error)
                        console.log(error.response?.data)

                        alert(
                            error.response?.data?.message ||
                            'Booking Failed'
                        )

                        setPaying(false)
                    }
                },

                modal: {
                    ondismiss: function() {
                        console.log('Payment window closed')
                        setPaying(false)
                    }
                },

                theme: {
                    color: '#2563eb'
                }
            }
            // console.log('Razorpay object:', window.Razorpay)
            // console.log('Razorpay key:', import.meta.env.VITE_RAZORPAY_KEY_ID)
            // console.log('Order ID:', order.id)
            // console.log('Order amount:', order.amount)
            const razorpay = new window.Razorpay(options)

            razorpay.on('payment.failed', function(response) {
                console.log('Payment Failed')
                console.log(response)

                alert(
                    response.error?.description ||
                    'Payment Failed'
                )

                setPaying(false)
            })

            console.log('3. Opening Razorpay checkout...')

            razorpay.open()
        } catch (error) {
            console.log(error)
            console.log(error.response?.data)

            alert(
                error.response?.data?.message ||
                error.message ||
                'Payment Failed'
            )

            setPaying(false)
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen flex justify-center items-center text-xl'>
                Loading...
            </div>
        )
    }

    if (!room) {
        return (
            <div className='min-h-screen flex justify-center items-center text-xl'>
                Room not found
            </div>
        )
    }

   return (
    <div className='min-h-screen bg-slate-50 py-8 px-4'>
        <div className='max-w-6xl mx-auto'>

            <button
                onClick={() => navigate(-1)}
                className='text-green-700 font-medium mb-6 hover:text-green-900'
            >
                ← Back to Room
            </button>

            <div className='mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-slate-800'>
                    Complete Your Booking
                </h1>

                <p className='text-gray-500 mt-2'>
                    Enter your stay details and complete your secure payment.
                </p>
            </div>

            <div className='grid lg:grid-cols-3 gap-8'>

                <div className='lg:col-span-2 space-y-6'>

                    <div className='bg-white rounded-2xl shadow-md p-6 md:p-8'>

                        <div className='flex items-center gap-3 mb-7'>
                            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold'>
                                1
                            </div>

                            <div>
                                <h2 className='text-xl font-bold text-slate-800'>
                                    Stay Details
                                </h2>

                                <p className='text-sm text-gray-500'>
                                    Choose your check-in and check-out dates
                                </p>
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-5'>

                            <div>
                                <label className='block font-medium text-gray-700 mb-2'>
                                    Check In
                                </label>

                                <input
                                    type='date'
                                    name='checkIn'
                                    value={formData.checkIn}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                    required
                                />
                            </div>

                            <div>
                                <label className='block font-medium text-gray-700 mb-2'>
                                    Check Out
                                </label>

                                <input
                                    type='date'
                                    name='checkOut'
                                    value={formData.checkOut}
                                    min={
                                        formData.checkIn ||
                                        new Date().toISOString().split('T')[0]
                                    }
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                    required
                                />
                            </div>

                        </div>

                        <div className='mt-5'>

                            <label className='block font-medium text-gray-700 mb-2'>
                                Number of Guests
                            </label>

                            <input
                                type='number'
                                name='guests'
                                value={formData.guests}
                                min='1'
                                max={room.capacity}
                                onChange={handleChange}
                                className='w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                            />

                            <p className='text-sm text-gray-500 mt-2'>
                                Maximum capacity: {room.capacity} guests
                            </p>

                        </div>
                        <div className='mt-4 space-y-2 text-sm text-gray-600'>
                            <p>📅 Check In: {formData.checkIn || 'Select date'}</p>
                            <p>📅 Check Out: {formData.checkOut || 'Select date'}</p>
                        </div>

                    </div>

                    <div className='bg-white rounded-2xl shadow-md p-6 md:p-8'>

                        <div className='flex items-center gap-3 mb-7'>
                            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold'>
                                2
                            </div>

                            <div>
                                <h2 className='text-xl font-bold text-slate-800'>
                                    Offers & Discounts
                                </h2>

                                <p className='text-sm text-gray-500'>
                                    Have a coupon? Apply it here.
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3'>

                            <input
                                type='text'
                                name='couponCode'
                                value={formData.couponCode}
                                onChange={handleChange}
                                placeholder='Enter coupon code'
                                className='flex-1 border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-green-500'
                            />

                            <button
                                type='button'
                                onClick={applyCoupon}
                                className='bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-semibold transition'
                            >
                                Apply Coupon
                            </button>

                        </div>

                    </div>

                    <div className='bg-white rounded-2xl shadow-md p-6 md:p-8'>

                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold'>
                                3
                            </div>

                            <div>
                                <h2 className='text-xl font-bold text-slate-800'>
                                    Secure Payment
                                </h2>

                                <p className='text-sm text-gray-500'>
                                    Your payment is securely processed by Razorpay.
                                </p>
                            </div>
                        </div>

                        <div className='bg-green-50 border border-green-100 rounded-xl p-4 mb-6'>
                            <div className='flex gap-3'>
                                <span className='text-green-600 text-xl'>
                                    🔒
                                </span>

                                <div>
                                    <p className='font-semibold text-green-800'>
                                        Secure & Protected Payment
                                    </p>

                                    <p className='text-sm text-green-700 mt-1'>
                                        Your payment information is securely processed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={
                                paying ||
                                !formData.checkIn ||
                                !formData.checkOut ||
                                priceDetails.finalAmount <= 0
                            }
                            className='w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {paying
                                ? 'Processing Payment...'
                                : `Pay ₹${priceDetails.finalAmount}`}
                        </button>

                    </div>

                </div>

                <div className='bg-white rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-6'>

                    <div className='flex items-center justify-between mb-5'>
                        <h2 className='text-2xl font-bold text-slate-800'>
                            Booking Summary
                        </h2>

                        <span className='text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full'>
                            Secure
                        </span>
                    </div>

                    <img
                        src={
                            room.images?.[0]
                                ? `https://hotel-booking-system-backend-bzcx.onrender.com${room.images[0]}`
                                : 'https://placehold.co/600x400?text=No+Image'
                        }
                        alt={room.roomType}
                        className='w-full h-52 object-cover rounded-xl'
                    />

                    <div className='mt-5'>
                        <h3 className='text-xl font-bold text-slate-800'>
                            {room.hotelId.name}
                        </h3>

                        <p className='text-green-700 font-medium mt-1'>
                            {room.roomType}
                        </p>

                        <p className='text-gray-500 text-sm mt-1'>
                            👤 Up to {room.capacity} guests
                        </p>
                    </div>

                    <hr className='my-6' />

                    <div className='space-y-4 text-sm'>

                        <div className='flex justify-between'>
                            <span className='text-gray-500'>
                                Room Price
                            </span>

                            <span className='font-medium'>
                                ₹{room.price} × {priceDetails.totalDays || 0}
                            </span>
                        </div>

                        <div className='flex justify-between'>
                            <span className='text-gray-500'>
                                Nights
                            </span>

                            <span className='font-medium'>
                                {priceDetails.totalDays}
                            </span>
                        </div>

                        <div className='flex justify-between'>
                            <span className='text-gray-500'>
                                Subtotal
                            </span>

                            <span className='font-medium'>
                                ₹{priceDetails.originalPrice}
                            </span>
                        </div>

                        {priceDetails.discountAmount > 0 && (
                            <div className='flex justify-between text-green-600'>
                                <span>
                                    Discount ({priceDetails.discount}%)
                                </span>

                                <span className='font-semibold'>
                                    -₹{priceDetails.discountAmount}
                                </span>
                            </div>
                        )}

                    </div>

                    <hr className='my-6' />

                    <div className='flex justify-between items-center'>
                        <span className='text-xl font-bold'>
                            Total
                        </span>

                        <span className='text-2xl font-bold text-green-700'>
                            ₹{priceDetails.finalAmount}
                        </span>
                    </div>

                    <div className='mt-6 space-y-3 text-sm text-gray-600'>

                        <p>
                            ✓ Free cancellation
                        </p>

                        <p>
                            ✓ Secure Razorpay payment
                        </p>

                        <p>
                            ✓ Instant booking confirmation
                        </p>

                        <p>
                            ✓ Email confirmation after payment
                        </p>

                    </div>

                </div>

            </div>
        </div>
    </div>
    )
}

export default Bookings

