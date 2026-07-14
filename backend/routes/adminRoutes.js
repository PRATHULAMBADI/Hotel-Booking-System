const express = require('express')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/authMiddleware')
const { getDashboard } = require('../controllers/adminController')


router.get(
    '/dashboard',
    protect,
    adminOnly,
    getDashboard
)


module.exports = router