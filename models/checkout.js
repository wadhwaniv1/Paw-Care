const mongoose = require('mongoose');
const Order = require("./order");
//const order = mongoose.model('order', Order);

const checkoutSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique : true
    },
    contact :{
        type: Number,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    Order : Array
})

const Checkout = new mongoose.model("Checkout",checkoutSchema);

module.exports = Checkout;