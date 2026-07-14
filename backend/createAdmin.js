require('dotenv').config()

const dns = require('dns')

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

dns.setServers(['1.1.1.1', '8.8.8.8'])

const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL)

        const existingAdmin = await User.findOne({
            email: 'admin@gmail.com'
        })

        if (existingAdmin) {
            console.log('Admin already exists')
            process.exit()
        }

        const hashedPassword = await bcrypt.hash(
            'admin123',
            10
        )

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            phone: '',
            role: 'admin'
        })

        console.log('Admin created successfully')
        console.log({
            email: admin.email,
            role: admin.role
        })

        process.exit()

    } catch (error) {

        console.log(error.message)
        process.exit()

    }

}

createAdmin()