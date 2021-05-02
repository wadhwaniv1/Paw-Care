const mongoose = require('mongoose');
const validator = require('validator');

//product schema
const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 3,
        unique: [true, "Product Name already present"]
    },
    price : {
        type: Number,
        required: true
    },
    desc : String
})

//collection(model) creation
const Product = new mongoose.model("Product",productSchema);

module.exports = Product;