// const { errorResponse, successResponse } = require("../utils/reponse");
const{ 
    uploadImage,
    getImage
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
    return res.status(403).json({
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

    const imageData = await uploadImage(file,userId); // returns { a key }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      key:imageData.key
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

const getMyImagesController=async(req,res)=>{ 

}; 

module.exports={ 
    getImagebyIdController,
    uploadImageController,
    transformImageController,
    getMyImagesController
}