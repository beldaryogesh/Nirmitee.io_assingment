const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')
const pinValidator = require('pincode-validator')
const { isValidRequestBody, isValid,  nameRegex, emailRegex, passRegex, phoneRegex } = require("../validations/validator")

const createUser = async function (req, res) {
    try {
        let data = req.body;
        if(!isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Provide the data in request body for User creation." })
        }
        let { fname, lname, email, password, phone, address } = data
        if(!isValid(fname)){
            return res.status(400).send({ status: false, message: "Please enter the user fname." })
        }
        if(!nameRegex.test(fname)){
            return res.status(400).send({ status: false, message: "fname should contain alphabets only." })
        }
        if(!isValid(lname)){
            return res.status(400).send({ status: false, message: "Please enter the user lname." })
        }
        if(!nameRegex.test(lname)){
            return res.status(400).send({ status: false, message: "lname should contain alphabets only." })
        }
        if(!isValid(email)){
            return res.status(400).send({ status: false, message: "Please enter the user email." })
        }
        if(!emailRegex.test(email)){
            return res.status(400).send({ status: false, message: "Please enter the user email" })
        }
        let getEmail = await userModel.findOne({email : email})
        if(getEmail){
            return res.status(400).send({ status: false, message: "Email is already in use, please enter a new one " });
        }
        if(!isValid(password)){
            return res.status(400).send({ status: false, message: "Please enter the password." })
        }
        if(!passRegex.test(password)){
            return res.status(400).send({ status: false, message: "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character." })
        }
        if(!isValid(phone)){
            return res.status(400).send({ status: false, message: "Please enter the phone number." })
        }
        if (!phoneRegex.test(phone)) { 
        return res.status(400).send({ status: false, message: "Enter the phone number in valid Indian format." })
        }
        let getPhone = await userModel.findOne({ phone: phone }); 
        if (getPhone) { 
            return res.status(400).send({ status: false, message: "Phone number is already in use, please enter a new one. ⚠️" });
        }
        if(address) {
            if(!isValid(data.address.street) || !isValid(data.address.city) || !isValid(data.address.pincode)){
                return res.status(400).send({ status: false, message: "Enter the street, city and pincode in the address." })
            }
            let pinValidated = pinValidator.validate(data.address.pincode)
            if (!pinValidated){
                 return res.status(400).send({ status: false, message: "Please enter a valid pincode." })
            }
        }
        let userCreated = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: userCreated })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res){
  try {
    let email = req.body.email;
    let password = req.body.password;
    if(!email){
        return res.status(400).send({ status: false, msg: "Provide the email and password to login." })
    }
    if(!emailRegex.test(email)){
        return res.status(400).send({ status: false, message: "Please enter the user email" })
    }
    if(!password){
        return res.status(400).send({ status: false, msg: "Provide password to login." })
    }

    let user = await userModel.findOne({ email : email, password : password })
    if( !user ){
        return res.status(401).send({ status: false, msg: "Email or password is incorrect." })  
    }

    let token = jwt.sign(
        {
            userId : user._id.toString(),
            organisation: "Nirmitee_io"
        },
        "Nirmitee_io_assingment"
    )

    res.setHeader("x-api-key", token)
    return res.status(200).send({ status : false, message: 'Success', data: token })
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message })
  }
} 
module.exports = { createUser , loginUser}  // --> exporting the functions