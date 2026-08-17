import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'



function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false) 
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/login',{
                email,
                password
            })

            sessionStorage.setItem('token', response.data.token)

            sessionStorage.setItem(
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

        }catch (error) {
            console.error("Login error:", error);

            alert(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">
                <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
                    LOGIN
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full px-4 py-3 border-1 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                   <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-emerald-300 rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-800"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login