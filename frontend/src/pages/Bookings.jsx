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
    }, [formData.checkIn, formData.checkOut, room])

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
            console.log('Razorpay object:', window.Razorpay)
            console.log('Razorpay key:', import.meta.env.VITE_RAZORPAY_KEY_ID)
            console.log('Order ID:', order.id)
            console.log('Order amount:', order.amount)
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
        <div className='min-h-screen bg-slate-100 py-10 px-4'>
            <div className='max-w-6xl mx-auto grid lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 bg-white rounded-xl shadow-lg p-8'>
                    <h2 className='text-3xl font-bold mb-8'>
                        Complete Your Booking
                    </h2>

                    <div className='grid md:grid-cols-2 gap-6'>
                        <div>
                            <label className='font-medium block mb-2'>
                                Check In
                            </label>

                            <input
                                type='date'
                                name='checkIn'
                                value={formData.checkIn}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={handleChange}
                                className='w-full border rounded-lg p-3'
                                required
                            />
                        </div>

                        <div>
                            <label className='font-medium block mb-2'>
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
                                className='w-full border rounded-lg p-3'
                                required
                            />
                        </div>
                    </div>

                    <div className='mt-6'>
                        <label className='font-medium block mb-2'>
                            Guests
                        </label>

                        <input
                            type='number'
                            name='guests'
                            value={formData.guests}
                            min='1'
                            max={room.capacity}
                            onChange={handleChange}
                            className='w-full border rounded-lg p-3'
                        />
                    </div>

                    <div className='mt-6 flex gap-3'>
                        <input
                            type='text'
                            name='couponCode'
                            value={formData.couponCode}
                            onChange={handleChange}
                            placeholder='Coupon Code'
                            className='flex-1 border rounded-lg p-3'
                        />

                        <button
                            type='button'
                            onClick={applyCoupon}
                            className='bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg'
                        >
                            Apply
                        </button>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className='mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg disabled:bg-gray-400'
                    >
                        {
                            paying
                                ? 'Processing Payment...'
                                : `Pay ₹${priceDetails.finalAmount}`
                        }
                    </button>
                </div>

                <div className='bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6'>
                    <h3 className='text-2xl font-bold mb-6'>
                        Booking Summary
                    </h3>

                    <img 
                        src={
                            room.images?.[0]
                                ? `https://hotel-booking-system-backend-bzcx.onrender.com${room.images[0]}`
                                : 'https://placehold.co/600x400?text=No+Image'
                        }
                        alt={room.roomType} 
                        className='w-full h-56 object-cover rounded-lg mb-5' 
                    />

                    <h4 className='text-xl font-semibold'>
                        {room.hotelId.name}
                    </h4>

                    <p className='text-gray-500 mt-1'>
                        {room.roomType}
                    </p>

                    <hr className='my-5' />

                    <div className='space-y-3'>
                        <div className='flex justify-between'>
                            <span>Room Price</span>
                            <span>
                                ₹{room.price}/night
                            </span>
                        </div>

                        <div className='flex justify-between'>
                            <span>Nights</span>
                            <span>
                                {priceDetails.totalDays}
                            </span>
                        </div>

                        <div className='flex justify-between'>
                            <span>Subtotal</span>
                            <span>
                                ₹{priceDetails.originalPrice}
                            </span>
                        </div>

                        {
                            priceDetails.discountAmount > 0 && (
                                <div className='flex justify-between text-green-600'>
                                    <span>
                                        Discount ({priceDetails.discount}%)
                                    </span>

                                    <span>
                                        -₹{priceDetails.discountAmount}
                                    </span>
                                </div>
                            )
                        }

                        <hr />

                        <div className='flex justify-between text-2xl font-bold'>
                            <span>Total</span>

                            <span className='text-blue-600'>
                                ₹{priceDetails.finalAmount}
                            </span>
                        </div>
                    </div>

                    <div className='mt-6 text-sm text-gray-500'>
                        <p>✔ Free Cancellation</p>
                        <p>✔ Secure Razorpay Payment</p>
                        <p>✔ Instant Email Confirmation</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bookings

