const express = require('express');
const app = express();
const fs = require('fs');
const pdf = require('html-pdf');
const options = { format: 'A4' };

app.post("/", (req, res) => {
    res.render("demopdf", {
        email: req.body.email,
        price: req.body.price,
        address: req.body.address,
        contact: req.body.contact,
        fullname: req.body.fullname
    }, (err, html) => {
        pdf.create(html).toFile("./uploads/demopdf.pdf", function (err, result) {
            if (err) {
                return console.log(err);
            }
            else {
                var datafile = fs.readFileSync('./uploads/demopdf.pdf');
                res.setHeader('content-type', 'application/pdf');
                res.send(datafile);
            }
        });
    })
})

module.exports = app;