const express = require('express');
const Product = require("../models/products");
const path = require("path");
const axios = require("axios")

const router = new express.Router();
const app = express();
const staticPath = path.join(__dirname, "../public");
app.set("view engine", "ejs");
app.use(express.static(staticPath));

router.use(express.json());

router.get("/products", function(req, res) {
    const docs = Product.find({});
    docs.exec((err, data) => {
        if (err) throw err;
        res.render("products", {
            docs: data
        })
    })
});

//API
router.post("/products", async(req,res) => {
    if(!req.body){
        res.status(400).send({message: "Content can't be empty"});
        return;
    }
    
    try {
        //console.log(req.body);
        const p = new Product(req.body);
        const createP = await p.save();
        //alert("Data added successfully!")
        res.redirect('/products');
        
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get("/products/:name", async(req, res) => {
    try{
        const name = req.params.name;
        const productData = await Product.find({name});
        res.status(201).send(productData);
    }catch(err){
        res.status(400).send(err);
    }
})

router.post("/delete-products/:id", async(req, res) =>{
    try{
        const id = req.params.id;
        console.log(id);
        const delProduct = await Product.findByIdAndDelete(id);
        if(!id){
            return res.status(400).send();
        }
        res.redirect("../products");
    }catch(err){
        res.status(400).send(err);
    }
})

router.patch("/update/:id", async(req, res) =>{
    try{
        const _id = req.params.id;
        const updProduct = await Product.findByIdAndUpdate(_id, req.body);
        
        res.send(updProduct);
    }catch(err){
        res.status(404).send(err);
    }
})

module.exports = router;