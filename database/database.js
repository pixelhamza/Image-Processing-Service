const mongoose=require('mongoose');

const connectToDB=()=>{ 
    try{ 
        mongoose.connect(process.env.MONGO_URI);

    }catch(e){
        console.error("Unable to connect to Database");

    }
}
module.exports=connectToDB;