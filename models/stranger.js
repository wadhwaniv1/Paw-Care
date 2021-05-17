const mongoose = require("mongoose");

const strangerSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type: String,
        required: true,
    },
    latitude :{
        type: String,
        required: true,
    },
    longitude :{
        type: String,
        required: true,
    },
    img:
    {
        type: String,
        required: [true, "Uploaded file must have a name"]
    }
    /*image: {
        type: Buffer
    },
    contentType: {
        type: String
    }*/
})

const StrangerData = new mongoose.model("StrangerData",strangerSchema);
module.exports = StrangerData;