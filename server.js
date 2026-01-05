require('dotenv').config();
const express=require('express');


const app=express();
const PORT=process.env.PORT;

app.use(express.json());

// app.use('/images',imageRoutes);
// app.use('/auth',authRoutes)

app.listen(PORT,()=>console.log("Server Running"));