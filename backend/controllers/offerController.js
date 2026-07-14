const Offer = require('../models/Offer')

const getOffers = async (req,res)=>{
    try{
        const offers = await Offer.find()
        res.json(offers)
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
const createOffer = async (req,res)=>{
    try{
        const offer = await Offer.create(req.body)
        res.status(201).json(offer)
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
const updateOffer = async(req,res)=>{
    try{
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true
            }
        )
        res.json(offer)
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
const deleteOffer = async(req,res)=>{
    try{
        await Offer.findByIdAndDelete(req.params.id)
        res.json({
            message:'Offer deleted'
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
module.exports = {
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer
}