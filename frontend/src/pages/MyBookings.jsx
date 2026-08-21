import { useEffect, useState } from 'react'
import api from '../services/api'

function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [selectedBooking, setSelectedBooking] = useState(null)

    const getBookings = async () => {
        try {
            const token = sessionStorage.getItem('token')

            const response = await api.get('/bookings/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setBookings(response.data.bookings)
        } catch (error) {
            console.log(error.message)
        }
    }

    const cancelBooking = async (id) => {
        try {
            const token = sessionStorage.getItem('token')

            await api.put(
                `/bookings/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert('Booking cancelled')
            getBookings()
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel booking')
        }
    }

    const downloadInvoice = () => {
        const invoice = document.getElementById('invoice')

        if (!invoice) {
            return
        }

        const printWindow = window.open('', '_blank')

        printWindow.document.write(`
            <html>
                <head>
                    <title>Booking Invoice</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background: #f8fafc;
                            padding: 30px;
                        }

                        .invoice {
                            max-width: 700px;
                            margin: auto;
                            background: white;
                            padding: 35px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                        }

                        .header {
                            text-align: center;
                            border-bottom: 2px solid #16a34a;
                            padding-bottom: 20px;
                            margin-bottom: 25px;
                        }

                        .header h1 {
                            color: #166534;
                            margin-bottom: 5px;
                        }

                        .header p {
                            color: #666;
                        }

                        .hotel {
                            margin-bottom: 25px;
                        }

                        .hotel h2 {
                            margin-bottom: 5px;
                            color: #1e293b;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 15px;
                        }

                        td {
                            border: 1px solid #ddd;
                            padding: 12px;
                        }

                        td:first-child {
                            font-weight: bold;
                            background: #f8fafc;
                            width: 40%;
                        }

                        .total {
                            font-size: 18px;
                            font-weight: bold;
                            color: #15803d;
                        }

                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #666;
                            font-size: 13px;
                        }

                        @media print {
                            body {
                                background: white;
                                padding: 0;
                            }

                            .invoice {
                                border: none;
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>

                <body>
                    ${invoice.innerHTML}

                    <script>
                        window.onload = function() {
                            window.print()
                        }
                    </script>
                </body>
            </html>
        `)

        printWindow.document.close()
    }

    useEffect(() => {
        getBookings()
    }, [])

    return (
        <div className='min-h-screen bg-slate-50 px-6 py-10'>
            <div className='max-w-5xl mx-auto'>

                <h2 className='text-3xl font-bold text-slate-800 text-center mb-8'>
                    My Bookings
                </h2>

                {
                    bookings.length === 0 ? (

                        <p className='text-center text-gray-500 text-lg'>
                            No bookings found
                        </p>

                    ) : (

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                            {
                                bookings.map((booking) => (

                                    <div
                                        key={booking._id}
                                        className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition'
                                    >

                                        <h3 className='text-xl font-semibold text-slate-800 mb-4'>
                                            {booking.hotelId?.name}
                                        </h3>

                                        <p className='text-gray-600 mb-2'>
                                            Room: {booking.roomId?.roomType}
                                        </p>

                                        <p className='text-gray-600 mb-2'>
                                            Check In: {new Date(booking.checkIn).toDateString()}
                                        </p>

                                        <p className='text-gray-600 mb-2'>
                                            Check Out: {new Date(booking.checkOut).toDateString()}
                                        </p>

                                        <p className='text-green-600 font-semibold mb-2'>
                                            Price: ₹{booking.totalPrice}
                                        </p>

                                        <p className='text-gray-600 mb-4'>
                                            Status: {booking.bookingStatus}
                                        </p>

                                        <div className='flex flex-wrap gap-3'>

                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className='bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition'
                                            >
                                                View Invoice
                                            </button>

                                            {
                                                booking.bookingStatus === 'Booked' && (

                                                    <button
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className='bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition'
                                                    >
                                                        Cancel Booking
                                                    </button>

                                                )
                                            }

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

                {
                    selectedBooking && (

                        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>

                            <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>

                                <div className='p-6'>

                                    <div
                                        id='invoice'
                                        className='bg-white p-2'
                                    >

                                        <div className='text-center border-b-2 border-green-600 pb-5 mb-6'>

                                            <h1 className='text-3xl font-bold text-green-800'>
                                                Hotel Booking System
                                            </h1>

                                            <p className='text-gray-500 mt-1'>
                                                Booking Invoice
                                            </p>

                                        </div>

                                        <div className='mb-6'>

                                            <h2 className='text-xl font-bold text-slate-800'>
                                                {selectedBooking.hotelId?.name || 'Hotel'}
                                            </h2>

                                            <p className='text-gray-600'>
                                                {selectedBooking.roomId?.roomType || 'Room'}
                                            </p>

                                        </div>

                                        <table className='w-full border-collapse'>

                                            <tbody>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Booking ID
                                                    </td>

                                                    <td className='border p-3'>
                                                        {selectedBooking._id}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Check In
                                                    </td>

                                                    <td className='border p-3'>
                                                        {new Date(selectedBooking.checkIn).toDateString()}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Check Out
                                                    </td>

                                                    <td className='border p-3'>
                                                        {new Date(selectedBooking.checkOut).toDateString()}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Guests
                                                    </td>

                                                    <td className='border p-3'>
                                                        {selectedBooking.guests}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Discount
                                                    </td>

                                                    <td className='border p-3'>
                                                        ₹{selectedBooking.discount || 0}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Total Amount
                                                    </td>

                                                    <td className='border p-3 text-green-700 font-bold text-lg'>
                                                        ₹{selectedBooking.totalPrice}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Payment Status
                                                    </td>

                                                    <td className='border p-3'>
                                                        {selectedBooking.paymentStatus}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Payment ID
                                                    </td>

                                                    <td className='border p-3 break-all'>
                                                        {selectedBooking.paymentId}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Order ID
                                                    </td>

                                                    <td className='border p-3 break-all'>
                                                        {selectedBooking.orderId}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='border p-3 font-semibold bg-slate-50'>
                                                        Booking Status
                                                    </td>

                                                    <td className='border p-3'>
                                                        {selectedBooking.bookingStatus}
                                                    </td>
                                                </tr>

                                            </tbody>

                                        </table>

                                        <div className='text-center mt-8 pt-5 border-t'>

                                            <p className='text-gray-600'>
                                                Thank you for choosing Hotel Booking System.
                                            </p>

                                            <p className='text-gray-500 text-sm mt-2'>
                                                Please carry a valid government ID during check-in.
                                            </p>

                                        </div>

                                    </div>

                                    <div className='flex justify-end gap-3 mt-6'>

                                        <button
                                            onClick={() => setSelectedBooking(null)}
                                            className='px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition'
                                        >
                                            Close
                                        </button>

                                        <button
                                            onClick={downloadInvoice}
                                            className='px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
                                        >
                                            Download Invoice
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                }

            </div>
        </div>
    )
}

export default MyBookings