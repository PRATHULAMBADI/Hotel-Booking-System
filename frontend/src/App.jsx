import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails'
import Bookings from './pages/Bookings'
import MyBookings from './pages/MyBookings'
import SearchRooms from './pages/SearchRooms'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageHotels from './pages/admin/ManageHotels'
import ManageRooms from './pages/admin/ManageRooms'
import ManageBookings from './pages/admin/ManageBookings'
import ManageReviews from './pages/admin/ManageReviews'
import ManageOffers from './pages/admin/ManageOffers'

import Navbar from './components/Navbar'

// console.log('APP FILE LOADED')

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>

                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/hotels' element={<Hotels />} />
                <Route path='/hotel/:id' element={<HotelDetails />} />
                <Route path='/booking/:roomId' element={<Bookings />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/search'  element={<SearchRooms />}/>
                <Route path='/admin/dashboard' element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />

                <Route path='/admin/hotels' element={
                    <AdminRoute>
                        <ManageHotels />
                    </AdminRoute>
                } />

                <Route path='/admin/rooms' element={
                    <AdminRoute>
                        <ManageRooms />
                    </AdminRoute>
                } />

                <Route path='/admin/bookings' element={
                    <AdminRoute>
                        <ManageBookings />
                    </AdminRoute>
                } />

                <Route path='/admin/reviews' element={
                    <AdminRoute>
                        <ManageReviews />
                    </AdminRoute>
                } />

                <Route path='/admin/offers' element={
                    <AdminRoute>
                        <ManageOffers />
                    </AdminRoute>
                } />
                
            </Routes>
        </BrowserRouter>
    )
}
export default App