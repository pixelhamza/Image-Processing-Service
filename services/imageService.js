const{uploadToS3}=require('../utils/connectToS3');
const Image=require("../models/Image");

const uploadImage= async(file)=>{ 
    const ImageURL=await uploadToS3(file); 
    const image= new Image({ 
        url:ImageURL.url,
    })
    await image.save(); 
    return ImageURL;


}

module.exports={ 
    uploadImage
}

