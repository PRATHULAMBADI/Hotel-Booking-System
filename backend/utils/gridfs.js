const mongoose = require('mongoose')
const { GridFSBucket, ObjectId } = require('mongodb')

let bucket

exports.getBucket = () => {

    if (!mongoose.connection.db) {
        throw new Error('MongoDB connection is not ready')
    }

    if (!bucket) {
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'images'
        })
    }

    return bucket
}

exports.uploadImage = (file) => {

    return new Promise((resolve, reject) => {

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
    })
}

exports.deleteImage = (fileId) => {

    return new Promise(async (resolve, reject) => {

        try {

            const bucket = getBucket()

            await bucket.delete(
                new ObjectId(fileId)
            )

            resolve()

        } catch (error) {
            reject(error)
        }
    })
}
