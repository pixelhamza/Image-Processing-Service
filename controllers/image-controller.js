// const { errorResponse, successResponse } = require("../utils/reponse");
const{ 
    uploadImage,
    getImage,
    deleteImage,
    getMyImages
}=require("../services/imageService");


const getImagebyIdController=async(req,res)=>{ 
  try{
  const userId=req.user.userId;
  const imageId=req.params.id;

  const signedUrl=await getImage(imageId,userId); //pass the imageid and userId to the service layer
  return res.status(200).json({
      success: true,
      url: signedUrl
    });

  }catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

};

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
    const userId=req.user.userId;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File and user are required"
      });
    }

    const imageKey = await uploadImage(file,userId); // returns { a key }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      key:imageKey
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, retry again"
    });
  }
};


const transformImageController= async(req,res)=>{ 

};

const getMyImagesController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1; //10 images per page
    const limit = parseInt(req.query.limit) || 10;

    const data = await getMyImages(userId, page, limit);

    return res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({success: false,message: "Failed to fetch images"});
  }
};


const deleteImageController=async(req,res)=>{ 
  try{ 
    const imageId=req.params.id; 
    const userId=req.user.userId;

    await deleteImage(imageId,userId);

    return res.status(200).json({success:true,message: "Image deleted successfully"});

    
  }catch(error){ 
    console.error("Error Occured while deleting Image"); 

    if (error.message === "Image not found"){return res.status(404).json({ error: error.message });}

    if (error.message === "Unauthorized user") {return res.status(403).json({ error: error.message });}

    return res.status(500).json({error: "Failed to delete image"});

  }

}

module.exports={ 
    getImagebyIdController,
    uploadImageController,
    transformImageController,
    getMyImagesController,
    deleteImageController
}