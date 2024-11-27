const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/user.models');

exports.registerUser=async(req,res)=>{
    try{
        const{ name,email,password,role}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            role,
        });
        await newUser.save();
        res.status(201).json({message:'User registred Successfully'});
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
};

exports.loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;

        const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({message:'User Not Found'});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid Credentials'});
        }

        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.status(200).json({token,role:user.role,message:'Login successful'});
    }catch (error){
        res.status(500).json({message:'Server error',error:error.message});
    }
};