const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fname : {
            type : String,
            require : true,
        },
        lname : {
            type : String,
            require : true
        },
        email : {
            type : String,
            require : true,
            unique : true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        phone : {
            type : Number,
            require : true,
            unique : true
        },
        address: {
            street: { type: String },
            city: { type: String },
            pincode: { type: String }
        }
    },
    { timestamps : true }
)

module.exports = mongoose.model("User" , userSchema); // --> mongoose creates the model using the schema