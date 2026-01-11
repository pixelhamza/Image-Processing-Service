require("dotenv").config(); 
const fs=require("fs");
const{S3Client, PutObjectCommand, S3ServiceException}=require("@aws-sdk/client-s3");

const s3=new S3Client({ 
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY

    }
})

const uploadToS3=async(file)=>{ 
    const fileStream=fs.createReadStream(file.path);
    const uploadParams={
        BUCKET:process.env.BUCKET,
        key:file.filename,
        Body:fileStream,
        ContentType:file.mimetype
    };

    try{ 
        const command=await PutObjectCommand(uploadParams);
        const data=await s3.send(command);
        console.log("Image Uploaded SuccessFull",data)

    }catch(caught){
        if(caught instanceof S3ServiceException){
            console.error(`Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`,);
        }
        else{ 
            throw caught;
        }
    }
}



module.exports={s3,uploadToS3};