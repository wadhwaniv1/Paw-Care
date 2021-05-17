const express = require('express');
const app = express();
const fs = require('fs');
const pdf = require('html-pdf');
const options = { format: 'A4' };
const nodemailer = require("nodemailer");
const Checkout = require('../models/checkout');

app.post("/", async(req, res) => {
    try {
        const orderedData = await Checkout.find({email: req.body.email});
        //console.log(orderedData[0].Order);
        res.render("demopdf", {
            email: req.body.email,
            price: req.body.price,
            address: req.body.address,
            contact: req.body.contact,
            fullname: req.body.fullname,
            Order: orderedData[0].Order
        }, (err, html) => {
            //console.log(req.body.Order);
            pdf.create(html).toFile(`./uploads/${req.body.fullname}.pdf`, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                else {
                    var datafile = fs.readFileSync(`./uploads/${req.body.fullname}.pdf`);
                    res.setHeader('content-type', 'application/pdf');
                    res.send(datafile);
    
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
                        subject: 'Order recieved 🎉 PawCare!',
                        text: `Hello ${req.body.fullname}, Your order has been recieved. Expected delivery time within a week. Thank you for your support.`,
                        attachments: [{
                            filename: `${req.body.fullname}.pdf`,
                            path: `./uploads/${req.body.fullname}.pdf`,
                            contentType: 'application/pdf'
                          }]
                    }
    
                    transporter.sendMail(mailOptions, (err, data) =>{
                        if(err)
                        console.log(err);
                        else
                        console.log("Email sent!!");
                    })
                }
            });
        })
    } catch (error) {
        res.send(error);
    }
})

module.exports = app;