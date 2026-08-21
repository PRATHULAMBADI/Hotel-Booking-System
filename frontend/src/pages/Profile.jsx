import { useEffect, useState } from 'react'
import api from '../services/api'

function Profile() {
    const [profile, setProfile] = useState(null)
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile')

            setProfile(response.data)

            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                dateOfBirth: response.data.dateOfBirth
                    ? response.data.dateOfBirth.split('T')[0]
                    : '',
                gender: response.data.gender || '',
                address: {
                    street: response.data.address?.street || '',
                    city: response.data.address?.city || '',
                    state: response.data.address?.state || '',
                    country: response.data.address?.country || '',
                    pincode: response.data.address?.pincode || ''
                }
            })
        } catch (error) {
            console.error('Profile fetch error:', error)

            setError(
                error.response?.data?.message ||
                'Failed to load profile'
            )
        } finally {
            setLoading(false)
        }
    }

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

        if (name === 'pincode') {
            if (!/^\d{0,6}$/.test(value)) {
                return
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value
            }
        })
    }

    const handleSave = async (e) => {
    e.preventDefault()

    if (formData.dateOfBirth) {
        const today = new Date()
        const selectedDate = new Date(formData.dateOfBirth)

        today.setHours(0, 0, 0, 0)
        selectedDate.setHours(0, 0, 0, 0)

        if (selectedDate > today) {
            setError('Date of birth cannot be a future date')
            return
        }
    }

    setSaving(true)
        setMessage('')
        setError('')

        try {
            const response = await api.put('/users/profile', {
                name: formData.name,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address
            })

            setProfile({
                ...profile,
                ...response.data.user
            })

            setMessage(response.data.message)
            setIsEditing(false)
        } catch (error) {
            console.error('Profile update error:', error)

            setError(
                error.response?.data?.message ||
                'Failed to update profile'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            dateOfBirth: profile.dateOfBirth
                ? profile.dateOfBirth.split('T')[0]
                : '',
            gender: profile.gender || '',
            address: {
                street: profile.address?.street || '',
                city: profile.address?.city || '',
                state: profile.address?.state || '',
                country: profile.address?.country || '',
                pincode: profile.address?.pincode || ''
            }
        })

        setIsEditing(false)
        setError('')
        setMessage('')
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        setChangingPassword(true)
        setPasswordMessage('')
        setPasswordError('')

        try {
            const response = await api.put(
                '/users/change-password',
                passwordData
            )

            setPasswordMessage(response.data.message)

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })

            setShowPassword({
                current: false,
                new: false,
                confirm: false
            })
        } catch (error) {
            console.error('Password change error:', error)

            setPasswordError(
                error.response?.data?.message ||
                'Failed to change password'
            )
        } finally {
            setChangingPassword(false)
        }
    }

    const togglePassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        })
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <p className='text-green-700 font-medium'>
                    Loading profile...
                </p>
            </div>
        )
    }

    if (error && !profile) {
        return (
            <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
                <p className='text-red-600 font-medium'>
                    {error}
                </p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-slate-50 px-6 py-10'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-green-800'>
                        My Profile
                    </h1>

                    {!isEditing && (
                        <button
                            onClick={() => {
                                setIsEditing(true)
                                setMessage('')
                                setError('')
                            }}
                            className='bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition'
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {message && (
                    <div className='mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg'>
                        {message}
                    </div>
                )}

                {error && (
                    <div className='mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg'>
                        {error}
                    </div>
                )}

                <div className='bg-white rounded-2xl shadow-md p-8'>
                    <div className='flex items-center gap-5 mb-8'>
                        <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'>
                            <span className='text-3xl font-bold text-green-700'>
                                {profile.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div>
                            <h2 className='text-2xl font-semibold'>
                                {profile.name}
                            </h2>

                            <p className='text-gray-500'>
                                {profile.email}
                            </p>

                            <span className='inline-block mt-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full capitalize'>
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <div className='border-t pt-6'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-5'>
                                    Personal Information
                                </h3>

                                <div className='grid md:grid-cols-2 gap-5'>
                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Full Name
                                        </label>

                                        <input
                                            type='text'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Email
                                        </label>

                                        <input
                                            type='email'
                                            value={formData.email}
                                            disabled
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Phone
                                        </label>

                                        <input
                                            type='text'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength='10'
                                            required
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Date of Birth
                                        </label>

                                        <input
                                            type='date'
                                            name='dateOfBirth'
                                            value={formData.dateOfBirth}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={handleChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Gender
                                        </label>

                                        <select
                                            name='gender'
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        >
                                            <option value=''>
                                                Select Gender
                                            </option>

                                            <option value='male'>
                                                Male
                                            </option>

                                            <option value='female'>
                                                Female
                                            </option>

                                            <option value='other'>
                                                Other
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='border-t mt-8 pt-6'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-5'>
                                    Address
                                </h3>

                                <div className='grid md:grid-cols-2 gap-5'>
                                    <div className='md:col-span-2'>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Street
                                        </label>

                                        <input
                                            type='text'
                                            name='street'
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            City
                                        </label>

                                        <input
                                            type='text'
                                            name='city'
                                            value={formData.address.city}
                                            onChange={handleAddressChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            State
                                        </label>

                                        <input
                                            type='text'
                                            name='state'
                                            value={formData.address.state}
                                            onChange={handleAddressChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Country
                                        </label>

                                        <input
                                            type='text'
                                            name='country'
                                            value={formData.address.country}
                                            onChange={handleAddressChange}
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm text-gray-600 mb-1'>
                                            Pincode
                                        </label>

                                        <input
                                            type='text'
                                            name='pincode'
                                            value={formData.address.pincode}
                                            onChange={handleAddressChange}
                                            maxLength='6'
                                            className='w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-end gap-3 mt-8'>
                                <button
                                    type='button'
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className='px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition'
                                >
                                    Cancel
                                </button>

                                <button
                                    type='submit'
                                    disabled={saving}
                                    className='px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50'
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className='border-t pt-6'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-5'>
                                    Personal Information
                                </h3>

                                <div className='grid md:grid-cols-2 gap-5'>
                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Full Name
                                        </p>

                                        <p className='font-medium'>
                                            {profile.name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Email
                                        </p>

                                        <p className='font-medium'>
                                            {profile.email || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Phone
                                        </p>

                                        <p className='font-medium'>
                                            {profile.phone || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Gender
                                        </p>

                                        <p className='font-medium capitalize'>
                                            {profile.gender || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Date of Birth
                                        </p>

                                        <p className='font-medium'>
                                            {profile.dateOfBirth
                                                ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }).replace(/\//g, '-')
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='border-t mt-8 pt-6'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-5'>
                                    Address
                                </h3>

                                <div className='grid md:grid-cols-2 gap-5'>
                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Street
                                        </p>

                                        <p className='font-medium'>
                                            {profile.address?.street || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            City
                                        </p>

                                        <p className='font-medium'>
                                            {profile.address?.city || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            State
                                        </p>

                                        <p className='font-medium'>
                                            {profile.address?.state || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Country
                                        </p>

                                        <p className='font-medium'>
                                            {profile.address?.country || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Pincode
                                        </p>

                                        <p className='font-medium'>
                                            {profile.address?.pincode || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className='border-t mt-8 pt-6'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-5'>
                            Security
                        </h3>

                        {passwordMessage && (
                            <div className='mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg'>
                                {passwordMessage}
                            </div>
                        )}

                        {passwordError && (
                            <div className='mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg'>
                                {passwordError}
                            </div>
                        )}

                        <form
                            onSubmit={handlePasswordChange}
                            className='max-w-xl space-y-5'
                        >
                            <div className='relative'>
                                <label className='block text-sm text-gray-600 mb-1'>
                                    Current Password
                                </label>

                                <input
                                    type={showPassword.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value
                                        })
                                    }
                                    required
                                    className='w-full px-4 py-3 pr-16 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                />

                                <button
                                    type='button'
                                    onClick={() => togglePassword('current')}
                                    className='absolute right-3 bottom-3 text-sm text-gray-500 hover:text-green-600'
                                >
                                    {showPassword.current ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            <div className='relative'>
                                <label className='block text-sm text-gray-600 mb-1'>
                                    New Password
                                </label>

                                <input
                                    type={showPassword.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value
                                        })
                                    }
                                    pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
                                    title='Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
                                    required
                                    className='w-full px-4 py-3 pr-16 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                />

                                <button
                                    type='button'
                                    onClick={() => togglePassword('new')}
                                    className='absolute right-3 bottom-8 text-sm text-gray-500 hover:text-green-600'
                                >
                                    {showPassword.new ? 'Hide' : 'Show'}
                                </button>

                                <p className='text-xs text-gray-500 mt-1'>
                                    Minimum 8 characters with uppercase, lowercase, number and special character.
                                </p>
                            </div>

                            <div className='relative'>
                                <label className='block text-sm text-gray-600 mb-1'>
                                    Confirm New Password
                                </label>

                                <input
                                    type={showPassword.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value
                                        })
                                    }
                                    required
                                    className='w-full px-4 py-3 pr-16 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                />

                                <button
                                    type='button'
                                    onClick={() => togglePassword('confirm')}
                                    className='absolute right-3 bottom-3 text-sm text-gray-500 hover:text-green-600'
                                >
                                    {showPassword.confirm ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            <button
                                type='submit'
                                disabled={changingPassword}
                                className='px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50'
                            >
                                {changingPassword
                                    ? 'Changing Password...'
                                    : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile