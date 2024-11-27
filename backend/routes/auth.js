const express=require('express')
const {registerUser,loginUser}=require('../controller/authController');

const router=express.Router();

router.post('/api/auth/register',registerUser);

router.post('/login',loginUser);

module.exports=router;