const mongoose = require("mongoose");

const clotheSchema = new mongoose.Schema(
    {
        clotheName : {
            type : String,
            require : true,
            trim: true
        },
        clotheImage: {
            type: String,
            require : true,
            trim: true
        },
        style: {
            
            type: String,
            require : true,
            trim: true
        },
        department : {
            type: String,
            trim: true   //  man human boy girl
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        color : {
            type : String,
            require : true,
            trim: true
        },
        size: {
            type: [{
                type:String,
                enum:["S", "XS","M","X", "L","XXL", "XL"]
            }],
            required: true,
            trim: true,
            uppercase: true
        },  
        description: {
            type: String,
            required: true,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    }
)

module.exports = mongoose.model("Clothe" , clotheSchema); // --> mongoose creates the model using the schema