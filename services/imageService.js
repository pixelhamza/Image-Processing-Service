const{uploadToS3,
    getSignedImageUrl,
    deleteFromS3} = require('../utils/connectToS3');


const Image=require("../models/Image");

const uploadImage= async(file,userId)=>{ 
    const imageData=await uploadToS3(file); //s3 layer call to handle the uploading 
    const image= new Image({ 
        userId,
        imageKey:imageData.key
    })
    await image.save(); //fill the new entry and save
    return imageData; //pass it back to the controller 

}

const getImage=async(imageId,userId)=>{ 
    const image=await Image.findById(imageId); //find the image from the image table with that id 
    
    if (!image) {
      throw new Error("Image not found");
    }
    //basic identity check
    if(image.userId.toString()!==userId){
        throw new Error("Unauthorized User");
    }

    const signedUrl= await getSignedImageUrl(image.imageKey);// s3 layer call to handle the retreival
    return signedUrl; //pass it on to the controller 
}

const deleteImage= async(imageId,userId)=>{ 
    try{
    const image=await Image.findById(imageId);
    if (!image) {
      throw new Error("Image not found");
    }
    //basic identity check
    if(image.userId.toString()!==userId){
        throw new Error("Unauthorized User");
    }
    await deleteFromS3(image.imageKey);
    i
    await Image.findByIdAndDelete(imageId);

    return true;}
    
    catch(err){
        console.error("Delete image failed:", err.message);
        throw err;

    }
}


module.exports={ 
    uploadImage,
    getImage,
    deleteImage
}

