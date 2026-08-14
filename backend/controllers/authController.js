const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const { name, password, phone } = req.body
        const email = req.body.email?.trim().toLowerCase()

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email address'
            })
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
            })
        }

        const phoneRegex = /^[0-9]{10}$/

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: 'Phone number must contain exactly 10 digits'
            })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name: name.trim(),
            email,
            password: hashedPassword,
            phone
        })

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Registration failed'
        })
    }
}


// LOGIN USER
exports.login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const { password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Login failed'
        })
    }
}