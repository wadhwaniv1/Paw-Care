require('dotenv').config();
const express = require('express');
require("./db/conn")
const Product = require("./models/products");
const Order = require("./models/order");
const CustomerData = require("./models/signup");
const StrangerData = require("./models/stranger");
const productRouter = require('./routers/route');
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")
const nodemailer = require("nodemailer");
//const popupS = require('popups');
const bcrypt = require("bcryptjs");
const path = require("path");
const multer  = require('multer');
const crypto = require('crypto')
const Checkout = require('./models/checkout');
//const upload = multer({ dest: 'uploads/stranger/' });
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
app.use(cookieParser());
//app.use(morgan);

//to set the view engine
app.set("view engine", "ejs");

var cors = require('cors');
app.use(cors());

app.use("/generatepdf", require("./routers/generatePdf"));
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/login", (req, res) => {
    res.render("login",{
        message: null
    });
})

app.get("/stranger", (req, res) => {
    res.render("stranger");
})

app.get("/admin_login", (req, res) => {
    res.render("admin_login");
})

app.post("/admin_login", (req, res) => {
    email = req.body.email;
    pass = req.body.psw;

    if(email==="qwerty" && pass==="qwerty")
    res.redirect("products");
    else
    console.log("Invalid credentials!");
})

app.get("/admin_order", async (req, res) => {
    try {
        const orderedData = await Checkout.find({});
        res.render("admin_order", {
            docs: orderedData
        });
    } catch (error) {
        res.status(400).render("404");
    }

})

app.post("/checkout/:price", auth, async (req, res) => {
    const price = req.params.price;
    res.render("checkout", {
        price: price,
        user: req.user.username,
        email: req.user.email
    })
})

app.post("/checkout", auth, async (req, res) => {
    try {

        const orderData = await Order.find({ id: req.user._id });
        //console.log(orderData);
        const checkout = new Checkout({
            id: req.user._id,
            fullname: req.body.fullname,
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address,
            price: req.body.price,
            Order: orderData
        })
        console.log(checkout);
        //console.log(orderData);
        const ordered = await checkout.save();
        //console.log(ordered);
        res.status(201).redirect("cart");
    } catch (error) {
        res.status(400).render("404");
    }
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
        res.redirect("login");
        res.status(201);
    } catch (err) {
        //alert("Enter correct credentials.");
        res.status(400).send(err);
    }
})

app.post("/delete-stray/:id", async(req, res) =>{
    try{
        const id = req.params.id;
        const delProduct = await StrangerData.findByIdAndDelete(id);
        if(!id){
            return res.status(400).send();
        }
        res.redirect("../straypet");
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/delete-order/:id", async(req, res) =>{
    try{
        const id = req.params.id;
        const delProduct = await Checkout.findByIdAndDelete(id);
        if(!id){
            return res.status(400).send();
        }
        res.redirect("../admin_order");
    }catch(err){
        res.status(400).send(err);
    }
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
      
            cb(null, raw.toString('hex') + path.extname(file.originalname))
          })
    }
  })
   
var upload = multer({ storage: storage })

app.post("/stranger", upload.single('myfile'), async (req, res) => {
    try {
        
        const stranger = new StrangerData({
            email: req.body.email,
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            img: req.file.filename
        })

        const registered = await stranger.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        let mailOptions = {
            from: process.env.USER,
            to: req.body.email,
            subject: 'Congratulations 🎉 PawRanger!!!',
            text: `Congrats ${req.body.name}, you have helped a needy animal. You have earned the badge of Paw ranger🐶. Thank you for support.`
        }

        transporter.sendMail(mailOptions, (err, data) =>{
            if(err)
            console.log(err);
            else
            console.log("Email sent!!");
        })

        res.status(201).redirect("stranger");
    } catch (err) {
        //alert("Enter correct credentials.");
        res.status(400).render("404");
    }
})

app.post("/order", auth, async (req, res) => {
    try {
        //console.log(req.user._id);
        const orderData = await Order.find({ id: req.user._id });
        temp = false;
        for (i = 0; i < orderData.length; i++) {
            if (orderData[i].name === req.body.name) {
                t = i;
                temp = true;
                break;
            }
        }
        console.log(temp);
        if (temp) {
            //console.log(t);
            p = orderData[t].qty;
            p+=1;
            console.log(p);
            if(req.body.name == "German Shepherd") console.log("ok");
            Order.updateOne({ "name" : req.body.name, "id": req.user._id }, {$set: { "qty": p }}, (err,result) => {
                    if(err) console.log(err);
                    else console.log(result);
            });
        } else {
            const order = new Order({
                id: req.user._id,
                name: req.body.name,
                desc: req.body.desc,
                price: req.body.price,
                qty: 1
            })
            const ordered = await order.save();
        }
        res.status(201).redirect("dashb");
        //res.send("<script>alert('Order added to cart'); window.location.href = '/dashb'; </script>");
    } catch (error) {
        res.status(400).render("404");
    }
})

app.get("/petcare", auth, (req, res) => {
    //console.log(auth);
    res.render("petcare", {
        user: req.user.username
    });
})
app.get("/about", auth, (req, res) => {
    //console.log(auth);
    res.render("about", {
        user: req.user.username
    });
})
app.get("/disease", auth, (req, res) => {
    //console.log(auth);
    res.render("disease", {
        user: req.user.username
    });
})
app.get("/vet", auth, (req, res) => {
    //console.log(auth);
    res.render("vet", {
        user: req.user.username
    });
})


app.get("/cart", auth, async (req, res) => {
    //console.log(auth);
    try {
        const orderData = await Order.find({ id: req.user._id });
        //console.log(orderData);
        res.render("cart", {
            user: req.user.username,
            docs: orderData
        });
    } catch (error) {
        res.status(404).send(error);
    }

})

app.post("/cart/:id", async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id);
        const delorder = await Order.findByIdAndDelete(id);
        if (!id) {
            return res.status(400).send("Err");
        }
        res.redirect("../cart");
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("Logout successfully");
        res.redirect("/login");
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get("/dashb", auth, async (req, res) => {
    const docs = Product.find({});
    //console.log(docs);
    docs.exec((err, data) => {
        if (err) throw err;
        res.render("dashb", {
            docs: data,
            uname: req.user.username
        })
    })
})
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const psw = req.body.psw;
        const useremail = await CustomerData.findOne({ email: email });
        const isMatch = await bcrypt.compare(psw, useremail.psw);
        if (!isMatch) console.log("not matched");
        const token = await useremail.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true
        });
        //console.log(isMatch);
        if (isMatch) {
            res.redirect("/dashb");
        }
        else {
            //res.send("Invalid credentialss");
            //res.json({message: "Invalid credetianls"});
            res.render("login", {
                message: "Invalid credentials, try again"
            })
        }
    } catch (err) {
        res.status(400).send("Invalid credentials");
    }
})



app.get("*", (req, res) => {
    res.render("404");
})

app.listen(port, () => {
    console.log("Listening to port" + port)
})