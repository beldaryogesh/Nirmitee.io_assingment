const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const mongoose = require('mongoose'); 
const clotheModel = require("../models/clotheModel");
const { isValidObjectId } = require('mongoose')

const myFunc = token => {
    return jwt.verify(token, "Nirmitee_io_assingment",(arr, decode) =>{
        if(arr){
            return null;
        }else{
            return decode
        }
    })
}


const authenticate = async function (req, res, next){
    try {
        let token = req.headers["x-api-key"]
        if( !token ) {
            return res.status(401).send({ status : false, msg: "token must be present in request header." })
        }
        let decodedToken = myFunc(token)
        if (!decodedToken) {
            return res.status(403).send({ status: false, message: "invalid token" })
        }
        req.decodedToken = decodedToken

        next()
    } catch (err) {
        return res.status(500).send( { status: false, error: err.message} )
    }
}

const authorize = async function(req,res, next){
    try {
        let userId = req.body.userId;
        if(!userId){
            return res.status(400).send({ status: false, message: "please Provide userId." })
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "Provide a valid userId." })
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "userId not present." })
        }
        if (userId !== req.decodedToken.userId) return res.status(403).send({ status: false, message: "Provide your own userId to create a clothes." })
        next()
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authForParams = async function (req, res, next){
    try {
        let clotheId = req.params.clotheId;
        if(!clotheId || !isValidObjectId(clotheId)){
            return res.status(400).send({ status: false, message: "Provide a valid clothe in path params." })
        }
        let clothe = await clotheModel.findById(clotheId)
        if(!clothe){
            return res.status(404).send({ status: false, message: "clotheId not present." })
        }
        if(clothe.userId.toString() !== req.decodedToken.userId){
            return res.status(403).send({ status: false, message: "You are not authorized to access this clothe." })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { authenticate, authorize, authForParams }