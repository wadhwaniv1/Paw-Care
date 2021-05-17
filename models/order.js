const mongoose = require('mongoose');

//product schema
const orderSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true
    },
    desc : String,
    qty : Number
})

const Order = new mongoose.model("Order",orderSchema);

module.exports = Order;