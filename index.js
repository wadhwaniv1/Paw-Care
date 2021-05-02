require('dotenv').config();
const express = require('express');
//const bodyParser = require('body-parser')
require("./db/conn")
const Product = require("./models/products");
const CustomerData = require("./models/signup");
const StrangerData = require("./models/stranger");
const productRouter = require('./routers/route');
const bcrypt = require("bcryptjs");
const path = require("path");
const port = process.env.PORT || 8080;

const app = express();
//console.log(path.join(__dirname,"../"))
const staticPath = path.join(__dirname, "./public");
//middleware
app.use(express.static(staticPath));

//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(productRouter);
//app.use(morgan);

//to set the view engine
app.set("view engine", "ejs");

var cors = require('cors')
app.use(cors());


//template engine root
/*app.get("/dashb", (req, res) => {
    var users = Product.find({}, (err, docs) => {

        if (err) throw err;
        else {
            res.render("dashb", {
                docs
            });
        }

    });
    console.log(users);*/
    
    //res.send(docs);
    //console.log(docs);
    /*res.render("dashb",{
        docs
    })
})*/

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/stranger", (req, res) => {
    res.render("stranger");
})

app.get("/straypet", (req, res) => {
    const docs = StrangerData.find({});
    docs.exec((err, data) => {
        if (err) throw err;
        res.render("straypet", {
            docs: data
        })
    })
    //res.render("straypet");
})

app.post("/signup", async (req, res) => {
    try {
        const register = new CustomerData({
            email: req.body.email,
            username: req.body.username,
            psw: req.body.psw
        })

        //const token = await register.generateAuthToken();
        const registered = await register.save();
        res.status(201).render("login");
    } catch (err) {
        //alert("Enter correct credentials.");
        res.status(400).send(err);
    }
})

app.post("/stranger", async (req, res) => {
    try {
        const stranger = new StrangerData({
            email: req.body.email,
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        })

        const registered = await stranger.save();
        res.status(201).render("stranger");
    } catch (err) {
        //alert("Enter correct credentials.");
        res.status(400).send(err);
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const psw = req.body.psw;
        //const username = req.body.username;
        const useremail = await CustomerData.findOne({ email: email });
        const isMatch = await bcrypt.compare(psw, useremail.psw);
        const token = await useremail.generateAuthToken();
        if (isMatch) {
            const docs = Product.find({});
            docs.exec((err, data) => {
                if (err) throw err;
                res.render("dashb", {
                    docs: data,
                    uname: useremail.username
                })
            })
        }
        else {
            res.send("Invalid credentialss");
        }
    } catch (err) {
        res.status(400).send("Invalid credentials");
    }
})

app.get("*", (req, res) => {
    res.render("404");
})

app.listen(port, () => {
    console.log("Listening...")
})