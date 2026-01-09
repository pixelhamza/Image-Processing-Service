require('dotenv').config();
const express=require('express');
const connectToDB = require('./database/database');


const app=express();
const PORT=process.env.PORT;

connectToDB();

app.use(express.json());

// app.use('/images',imageRoutes);
// app.use('/auth',authRoutes)

app.listen(PORT,()=>console.log("Server Running"));