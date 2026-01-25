const{uploadToS3,
    getSignedImageUrl,
    deleteFromS3,
    getImageBufferFromS3} = require('../utils/connectToS3');

const sharp=require("sharp");
const redisClient=require("../utils/redisClient");
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

    const cachedImage=await redisClient.get(imageId);
    if(cachedImage){
      return JSON.parse(cachedImage);
    }
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


const transformImage=async(imageId,userId,transformations)=>{ 
    const cacheKey = `transform:${imageId}:${JSON.stringify(transformations)}:${userId}`; //create a cache key for the image

    const cachedUrl = await redis.get(cacheKey);
    if (cachedUrl){ return cachedUrl};


    const image = await Image.findById(imageId);

  if (!image) {
    throw new Error("Image not found");
  }

  if (image.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized User");
  }

  // download the original imagee
  const originalBuffer = await getImageBufferFromS3(image.imageKey);

  let pipeline = sharp(originalBuffer);//create an instance of the image to work on it

  // transformations
  if (transformations.resize) {
    const { width, height } = transformations.resize;
    pipeline = pipeline.resize(width, height);
  }

  
  if (transformations.crop) {
    const { width, height, x, y } = transformations.crop;
    pipeline = pipeline.extract({
      width,
      height,
      left: x,
      top: y
    });
  }


  if (transformations.rotate) {
    pipeline = pipeline.rotate(transformations.rotate);
  }


  if (transformations.filters) {
    if (transformations.filters.grayscale) {
      pipeline = pipeline.grayscale();
    }

    if (transformations.filters.sepia) {
      pipeline = pipeline.sepia();
    }
  }


  //generate transformed buffer
  const transformedBuffer = await pipeline.toBuffer();

  //upload transformed image
  const transformedKey = await uploadToS3({
    buffer: transformedBuffer,
    mimetype: `image/jpeg`,
    originalname: `transformed.jpg`
  });

   //new image record
  const newImage = new Image({
    userId,
    imageKey: transformedKey,
    parentImage: image._id,
    transformations
  });

  await newImage.save();

  const signedUrl=await getSignedImageUrl(transformedKey);

  await redis.set(cacheKey,signedUrl,{
    EX:500
  })

  return signedUrl;
};




module.exports={ 
    uploadImage,
    getImage,
    getMyImages,
    deleteImage,
    transformImage
}

