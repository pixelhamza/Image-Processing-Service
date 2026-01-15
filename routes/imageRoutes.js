const express=require('express');
const router=express.Router();

const auth = require("../middleware/authMiddleware");

const {getImagebyIdController, uploadImageController, transformImageController, getMyImagesController}=require('../controllers/image-controller');
const { GetBucketLocationCommand } = require("@aws-sdk/client-s3");
const {s3} = require("../utils/connectToS3");


const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max to prevent load on ram(can be scaled later)
});

// router.get("/check-s3", async (req, res) => {
//   try {
//     await s3.send(
//       new GetBucketLocationCommand({
//         Bucket: process.env.BUCKET_NAME
//       })
//     );

//     res.json({ ok: true, message: "S3 connection SUCCESS " });
//   } catch (err) {
//     res.status(500).json({
//       ok: false,
//       message: "S3 FAIL ",
//       error: err.name || err.message
//     });
//   }
// });
router.get('/my',auth,getMyImagesController);
router.get('/:id',auth,getImagebyIdController); 
router.post('/',auth,upload.single("image"),uploadImageController); 
router.post('/:id/transform',auth,transformImageController);



module.exports = router;