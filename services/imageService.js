const{uploadToS3}=require('../utils/connectToS3');
const Image=require("../models/Image");

const uploadImage= async(file,userId)=>{ 
    const imageData=await uploadToS3(file); 
    const image= new Image({ 
        userId,
        imageKey:imageData.key
    })
    await image.save(); 
    return imageData;


}

module.exports={ 
    uploadImage
}

