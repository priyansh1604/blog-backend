const db = require('../config/db');
const userQueries = require("../utils/queries/userQueries");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const insertUserService=async(name, email, mobile, password)=>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve,reject)=>{
        db.query(userQueries.insertUser,{name ,email ,mobile, password:hashedPassword},(err)=>{
            if (err) return reject (err);
            resolve();
        });
    });
}

const loginService=async(email,password)=>{
    try{
        const isEmail = /\S+@\S+\.\S+/.test(email);
        const query = isEmail ? userQueries.findUserByEmail : userQueries.findUserByMobile;

        const user = await new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error("Invalid email/Phone or password"));
                resolve(results[0]);
            });
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await new Promise((resolve, reject) => {
            db.query(userQueries.saveToken, [token, user.id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        return {
            token,
            user: { id: user.id, name: user.name },
        };
    }
    catch (error) {
        throw error;
    }
}
module.exports={insertUserService,loginService};


// JOI validation