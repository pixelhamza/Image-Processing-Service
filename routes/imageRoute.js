const express=require('express');
const router=express.Router();
const {getImagebyId,uploadImage,transformImage,getMyImages}=require('../controllers/image-controller');
const { GetBucketLocationCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/connectToS3");


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

router.get('/:id',getImagebyId); 
router.post('/',uploadImage); 
router.post('/:id/transform',transformImage);
router.get('/my',getMyImages);


module.exports = router;