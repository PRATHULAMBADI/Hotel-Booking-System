import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'



function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/login',{
                email,
                password
            })

            localStorage.setItem('token',response.data.token)

            localStorage.setItem(
                'user',
                JSON.stringify(response.data.user)
            )

            alert('Login successful')

            if(response.data.user.role === 'admin'){
                console.log('Admin redirect')
                console.log(response.data.user)
                navigate('/admin/dashboard')
            }else{
                navigate('/')
            }

        }catch(error){
            alert(error.response.data.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login