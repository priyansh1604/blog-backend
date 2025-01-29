const db=require('../../config/db');
const twilio=require('twilio');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { insertOTP, verifyOTP } = require('../queries/userQueries');

const twilioCLient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = (req,res)=>{
    const {mobile}=req.body;
    if(!mobile){
        return  res.status(400).json({ message: 'Mobile number is required' });
    }
    const otp=crypto.randomInt(100000,999999);
    try{
        const otpExpiry = Date.now()+5*60*1000; //5mins
        db.query(
            insertOTP,
            [otp, otpExpiry, mobile],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                twilioCLient.messages
                .create({
                    body: `Your login OTP is ${otp}. It is valid for 5 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${mobile}`,
                })
                .then(() => {
                    res.status(200).json({ message: 'OTP sent successfully' });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: 'Failed to send OTP', error });
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp=(req,res)=>{
    const {mobile,otp} = req.body;

    if(!mobile || !otp){
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }
    try {
        db.query(
            verifyOTP,
            [mobile, otp, Date.now()],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });

                if (results.length === 0) {
                    return res.status(400).json({ message: 'Invalid or expired OTP' });
                }

                const user = results[0];
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });

                db.query(
                    'UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = ?',
                    [user.id],
                    (err) => {
                        if (err) return res.status(500).json({ message: 'Database error', error: err });

                        res.status(200).json({
                            message: 'Login successful',
                            token,
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { sendOtp, verifyOtp};

