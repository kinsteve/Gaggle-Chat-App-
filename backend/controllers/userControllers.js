const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const generateToken =require("../config/generateJWTToken");
const bcrypt =require('bcryptjs');

const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, pic } = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all feilds");
    }
     console.log("Hello");
    const userExists = await User.exists({email:email});

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user= await User.create({
        name,
        email,
        password,
        pic,
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to Create the User")
    }
});

const authUser= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id),
        })
    } else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
})

//Searching a user from all users excluding the one logged in
const allUsers=asyncHandler(async(req,res)=>{
       const keyword = req.query.search?{              //  like req.params  ,req.query returns the value of query
        $or:[                                           // or operator in MongoDB
          {name:{$regex:req.query.search , $options:"i"}},               //regex is used if there is name = query.search and i represents case insensitive . . See docs
          {email:{$regex:req.query.search , $options:"i"}},
        ],
       }
      :{}; 

      const users =await User.find(keyword).find({_id:{$ne:req.user._id}})// ne means not equal to . It is done to remove the current user from search list
      res.send(users);
         
})

module.exports={
    registerUser,
    authUser,
    allUsers
}