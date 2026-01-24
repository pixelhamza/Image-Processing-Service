const{uploadToS3,
    getSignedImageUrl,
    deleteFromS3} = require('../utils/connectToS3');


const Image=require("../models/Image");

const uploadImage= async(file,userId)=>{ 
    const key=await uploadToS3(file); //s3 layer call to handle the uploading 
    const image= new Image({ 
        userId,
        imageKey:key
    })
    await image.save(); //fill the new entry and save
    return key; //pass it back to the controller 

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


const getMyImages = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const images = await Image.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ userId });

  const imagesWithUrls = await Promise.all(
    images.map(async (img) => ({
      id: img._id,
      url: await getSignedImageUrl(img.imageKey),
      createdAt: img.createdAt
    }))
  );

  return {
    images: imagesWithUrls,
    page,
    limit,
    total
  };
};



module.exports={ 
    uploadImage,
    getImage,
    deleteImage
}

