const mongoose=require("mongoose");

const ImageSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    imageKey:{ 
        type:String,
        required:true,
    }
    
},{
    timestamps:true
})

module.exports=mongoose.model('Image',ImageSchema);