// const { errorResponse, successResponse } = require("../utils/reponse");
const{ 
    uploadImage
}=require("../services/imageService");
const getImagebyIdController=async(req,res)=>{ 


};

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
    // const userId = "testUserId";

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File and user are required"
      });
    }

    const imageData = await uploadImage(file); // returns { message, url }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: imageData.url
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