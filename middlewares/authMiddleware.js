const jwt = require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Access Denied.No token provided.'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;        
        next();
    }catch(err){
        res.status(403).json({message:"Invalid or expired token"});
    }
};

const isAdmin = (req,res,next) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };

module.exports = { verifyToken, isAdmin };