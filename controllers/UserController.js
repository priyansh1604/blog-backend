const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const userQueries = require('../utils/queries/userQueries');
const userService = require('../Services/UserService');

const registerUser = async (req, res) => {
    const { name, email, mobile, password } = req.body;


    try {
        db.query(userQueries.register, [email,mobile], async (err, results) => {
            //if (err) return res.status(500).json({ message: 'Database error', error: err });
            if(results.length > 0){
                return res.status(400).json({
                    message: "Account Already Exist"
                })
            }
            await userService.insertUserService(name, email, mobile, password);
            return res.status(200).json({
                message: "User Registered successfully"
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'Email/Phone and password are required' });
    }
    try{
        const result = await userService.loginService(email, password);
        res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        if (error.message === "Invalid email/Phone or password" || error.message === "Invalid password") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
}

const logout = (req, res) => {
    const userId = req.user.id;

    db.query(userQueries.setTokenNull, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json({ message: 'Logout successful' });
    });
};

module.exports = { registerUser, loginUser,logout};


// mailtrap
//opt based login==   twilo
// BPC4ELPDWACKE7FHUGQKRS8B
// JOI validation middleware validation

// getProfile
// update profile

