const User=require("../models/User");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username already exists, please try logging in"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hash });
    await newUser.save();

    return res.status(200).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const login=async (req,res) => {
    const {username,password}=req.body; 
    try{ 

        const user=await User.findOne({username}); 

        if (!user) {
            return res
            .status(401)
            .json({success: false,message: "Invalid credentials"});
            }


        const isMatch=await bcrypt.compare(password,user.password);


        if(!isMatch){
            return res
            .status(401)
            .json({success: false,message: "Invalid credentials"});}
        
        const accessToken=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"30m"})
        res
        .status(200)
        .json({message:"Successfully logged in ",accessToken});
     
    }catch (error) {
            res
            .status(500)
            .json({message: "Something went wrong"});
        }
}


module.exports={ 
    register,login
}