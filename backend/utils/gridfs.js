const mongoose = require('mongoose')
const { GridFSBucket, ObjectId } = require('mongodb')

let bucket = null

const getBucket = () => {

    if (!mongoose.connection.db) {
        throw new Error('MongoDB connection is not ready')
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

const uploadImage = (file) => {

    return new Promise((resolve, reject) => {

        try {

            const bucket = getBucket()

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

        } catch (error) {
            reject(error)
        }
    })
}

const deleteImage = async (fileId) => {

    const bucket = getBucket()

    await bucket.delete(
        new ObjectId(fileId)
    )
}

module.exports = {
    getBucket,
    uploadImage,
    deleteImage
}