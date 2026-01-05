const express=require('express');
const router=express.Router;
const {getImagebyId,uploadImage,transformImage,getAllImages}=require('./c')



router.get('/:id',getImagebyId); 
router.post('/',uploadImage); 
router.post('/:id/transform',transformImage);
router.get('/',getMyImages);

