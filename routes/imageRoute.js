const express=require('express');
const router=express.Router();
const {getImagebyIdController, uploadImageController, transformImageController, getMyImagesController}=require('../controllers/image-controller');
const { GetBucketLocationCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const {s3} = require("../utils/connectToS3");
const upload = multer({ dest: "uploads/" });


router.get("/check-s3", async (req, res) => {
  try {
    await s3.send(
      new GetBucketLocationCommand({
        Bucket: process.env.BUCKET_NAME
      })
    );

    res.json({ ok: true, message: "S3 connection SUCCESS " });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "S3 FAIL ",
      error: err.name || err.message
    });
  }
});

router.get('/:id',getImagebyIdController); 
router.post('/',upload.single("image"),uploadImageController); 
router.post('/:id/transform',transformImageController);
router.get('/my',getMyImagesController);


module.exports = router;