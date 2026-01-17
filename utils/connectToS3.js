require("dotenv").config(); 
const{S3Client, PutObjectCommand, S3ServiceException}=require("@aws-sdk/client-s3");

const s3=new S3Client({ 
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY

    }
})

const uploadToS3=async(file)=>{ 


    const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    };

    
    try{ 
        const command=new PutObjectCommand(uploadParams); //constructing a command
        const data= await s3.send(command); //send the command to the client 

        return {
            message:"File uploaded Successfully",
            imageKey:uploadParams.Key
     
    }//returning a key to store in the db 
    

    }catch(caught){
        if(caught instanceof S3ServiceException){
            console.error(`Error from S3 while uploading object to ${process.env.BUCKET_NAME}.  ${caught.name}: ${caught.message}`,)
        }
        else throw caught;
    }
}



module.exports={s3,uploadToS3};
