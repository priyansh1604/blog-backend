const express = require('express');
const { registerUser , loginUser, logout} = require('../controllers/UserController');
const { sendOtp, verifyOtp } = require('../utils/otp_Sender/Otp');
const { resetPass, tokenResetPass } = require('../utils/Email/Email');
const validateRequest = require('../middlewares/ValidateRequest');
const { loginSchema, registerSchema } = require('../validators/authValidator');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register',validateRequest(registerSchema), registerUser);
router.post('/login',validateRequest(loginSchema), loginUser);
router.post('/logout', verifyToken, logout);

router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);

router.get('/admin-dashboard',verifyToken,isAdmin,(req,res)=>{
    res.status(200).json({message:"Welcome to admin dashboard"});
});

router.post('/reset-password',resetPass);
router.post('/reset-password/:token',tokenResetPass);

router.get('/profile',verifyToken,(req,res)=>{
    res.status(200).json({
        message:'Access granter to user',
        user: req.user ,
    });
});


module.exports = router;
