const mongoose=require("mongoose");

const ImageSchema= new mongoose.Schema({
    url:{
        type:String,
        require:true,
    },
    
})

module.exports=mongoose.model('Image',ImageSchema);