const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const { getBucket } = require('../utils/gridfs')

exports.getImage = async (req, res) => {

    try {

        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid image ID'
            })
        }

        const bucket = getBucket()

        const files = await bucket.find({
            _id: new ObjectId(id)
        }).toArray()

        if (!files || files.length === 0) {
            return res.status(404).json({
                message: 'Image not found'
            })
        }

        const file = files[0]

        res.set(
            'Content-Type',
            file.contentType || 'image/jpeg'
        )

        const downloadStream = bucket.openDownloadStream(
            new ObjectId(id)
        )

        downloadStream.on('error', () => {
            res.status(404).end()
        })

        downloadStream.pipe(res)

    } catch (error) {

        console.error('Get image error:', error)

        res.status(500).json({
            message: error.message
        })
    }
}