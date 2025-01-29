const nodemailer=require('nodemailer');
const dotenv=require ('dotenv');
const { generateToken, verifyToken } = require('../jwtHelper');
const bcrypt=require('bcryptjs');
dotenv.config();
const db=require('../../config/db');
const { findUserByEmail, updateUserPassword } = require('../queries/userQueries');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const resetPass=async(req,res)=>{
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    db.query(findUserByEmail, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const token = generateToken({ email }, '15m');
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        try {
            await sendEmail(
                email,
                'Password Reset Request',
                `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 15 minutes.</p>`
            );
            res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send email' });
        }
    });
}

const tokenResetPass=(req,res)=>{
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    
    try {
        const { email } = verifyToken(token);
        
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            db.query(
                updateUserPassword,
                [hashedPassword, email],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Server error' });

                    res.status(200).json({ message: 'Password updated successfully' });
                }
            );
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }

}

module.exports = { resetPass, tokenResetPass };
