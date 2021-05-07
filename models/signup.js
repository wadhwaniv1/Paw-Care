require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt =  require("jsonwebtoken");

const customerSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique : true
    },
    username : {
        type: String,
        required: true
    },
    psw : {
        type: String,
        required: true
    }
})

//instance method
customerSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        return token;
    }catch(err){
        console.log(err);
    }
}

customerSchema.pre("save", async function(next){
    //password hash bcrypt 10 rounds
    //const passwordHash = await bcrypt.hash(this.psw, 10);
    console.log(this.psw);
    this.psw = await bcrypt.hash(this.psw, 10);
    next();
})

const CustomerData = new mongoose.model("CustomerData",customerSchema);
module.exports = CustomerData;