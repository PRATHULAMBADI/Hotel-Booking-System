const mongoose = require('mongoose')
const { GridFSBucket, ObjectId } = require('mongodb')

let bucket = null

const getBucket = () => {

    if (!mongoose.connection.db) {
        throw new Error('MongoDB database connection is not ready')
    }

    if (!bucket) {
        bucket = new GridFSBucket(
            mongoose.connection.db,
            {
                bucketName: 'images'
            }
        )
    }

    return bucket
}


const uploadImage = async (file) => {

    if (!file || !file.buffer) {
        throw new Error('No image file received')
    }

    const bucket = getBucket()

    return new Promise((resolve, reject) => {

        const uploadStream = bucket.openUploadStream(
            file.originalname,
            {
                contentType: file.mimetype
            }
        )

        uploadStream.on('error', reject)

        uploadStream.on('finish', () => {
            resolve(uploadStream.id.toString())
        })

        uploadStream.end(file.buffer)
    })
}


const deleteImage = async (imageId) => {

    if (!imageId) {
        return
    }

    const bucket = getBucket()

    try {

        await bucket.delete(
            new ObjectId(imageId)
        )

    } catch (error) {

        // Image may already be deleted
        console.log(
            'GridFS delete warning:',
            error.message
        )
    }
}


module.exports = {
    getBucket,
    uploadImage,
    deleteImage
}