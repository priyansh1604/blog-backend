const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// const verifyToken = (token) => {
//     return jwt.verify(token, process.env.JWT_SECRET);
// };

const IsAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.id; 
        next(); 
    });
};

module.exports = { generateToken ,IsAuthenticated };
