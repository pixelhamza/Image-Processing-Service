require('dotenv').config();
const express=require('express');


const app=express();
const PORT=process.env.PORT;

app.use(express.json());

app.get('/',(req,res)=>{
    res.write("Service running");
    res.end(); 
})

app.listen(PORT,()=>console.log("Server Running"));