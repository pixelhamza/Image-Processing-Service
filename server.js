require('dotenv').config();
const express=require('express');
const connectToDB = require('./database/database');

const authRoute=require("./routes/authRoutes");
const imageRoute=require("./routes/imageRoutes");
const app=express();



const PORT=process.env.PORT || 3000;

connectToDB();

app.use(express.json());
app.use('/auth',authRoute)
app.use('/images',imageRoute);

app.get('/',async(req,res)=>{
    res.send("OK");
})


app.listen(PORT,()=>console.log("Server Running"));