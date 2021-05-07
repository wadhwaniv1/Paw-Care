const mongoose = require('mongoose');
require('dotenv').config();

//mongoose
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log("connection successful"))
.catch((err) => console.log(err));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



//create documrnt
/*const createDoc = async() => {
    try{
        const toraInu = new Product({
            name: "Russian Blue Cat",
            price: 600,
            desc: "xyz"
        })
        const res = await toraInu.save();
    }catch(err){
        console.log(err);
    }
}
createDoc();*/