require('dotenv').config();
const express=require('express');
const connectToDB = require('./database/database');

const checkS3=require("./routes/imageRoute")
const app=express();
const PORT=process.env.PORT || 3000;

connectToDB();

app.use(express.json());
// app.use("/api", checkS3);
// app.use('/images',imageRoutes);
// app.use('/auth',authRoutes)

app.listen(PORT,()=>console.log("Server Running"));