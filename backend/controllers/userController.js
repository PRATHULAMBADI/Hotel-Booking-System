const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        res.status(200).json(user)

    } catch (error) {
        console.error('Get Profile Error:', error)

        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            dateOfBirth,
            gender,
            address
        } = req.body

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (name !== undefined) {
            user.name = name.trim()
        }

        if (phone !== undefined) {
            user.phone = phone.trim()
        }

        if (dateOfBirth !== undefined) {
            if (dateOfBirth) {
                const today = new Date()
                const selectedDate = new Date(dateOfBirth)

                today.setHours(0, 0, 0, 0)
                selectedDate.setHours(0, 0, 0, 0)

                if (selectedDate > today) {
                    return res.status(400).json({
                        message: 'Date of birth cannot be a future date'
                    })
                }
            }

            user.dateOfBirth = dateOfBirth || null
        }
        if (gender !== undefined) {
            user.gender = gender
        }

        if (address) {
            user.address.street =
                address.street ?? user.address.street

            user.address.city =
                address.city ?? user.address.city

            user.address.state =
                address.state ?? user.address.state

            user.address.country =
                address.country ?? user.address.country

            user.address.pincode =
                address.pincode ?? user.address.pincode
        }

        const updatedUser = await user.save()

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profileImage: updatedUser.profileImage,
                dateOfBirth: updatedUser.dateOfBirth,
                gender: updatedUser.gender,
                address: updatedUser.address,
                role: updatedUser.role,
                favorites: updatedUser.favorites
            }
        })

    } catch (error) {
        console.error('Update Profile Error:', error)
        res.status(500).json({
            message: 'Profile update failed'
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'All password fields are required'
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'New password and confirm password do not match'
            })
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
            })
        }

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        )

        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            })
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: 'New password must be different from current password'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Change password error:', error)

        res.status(500).json({
            message: 'Failed to change password'
        })
    }
}

