import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

function Register() {

    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'name') {
            if (!/^[A-Za-z ]*$/.test(value)) {
                return
            }
        }

        if (name === 'phone') {
            if (!/^\d{0,10}$/.test(value)) {
                return
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/register', formData)

            alert(response.data.message)

            setFormData({
                name: '',
                email: '',
                password: '',
                phone: ''
            })
             navigate('/login')
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center px-6'>
            <div className='bg-white w-full max-w-md p-8 rounded-2xl shadow-md'>

                <h2 className='text-3xl font-bold text-center text-green-800 mb-6'>
                    REGISTER
                </h2>

                <form onSubmit={handleSubmit} className='space-y-4'>

                    <input
                        className='w-full px-4 py-3 border-1 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        type='text'
                        name='name'
                        placeholder='Full Name'
                        value={formData.name}
                        onChange={handleChange}
                        pattern='^[A-Za-z ]+$'
                        title='Name should contain only letters and spaces'
                        required
                    />

                    <input
                        className='w-full px-4 py-3 border-1 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className='w-full px-4 py-3 border-1 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
                        title='Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
                        required
                    />

                    <input
                        className='w-full px-4 py-3 border-1 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        type='text'
                        name='phone'
                        placeholder='Phone Number'
                        value={formData.phone}
                        onChange={handleChange}
                        pattern='^[0-9]{10}$'
                        title='Phone number must contain exactly 10 digits'
                        required
                    />

                    <button
                        type='submit'
                        className='w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition'
                    >
                        Register
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Register
