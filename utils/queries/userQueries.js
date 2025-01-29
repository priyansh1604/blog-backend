module.exports = {
    findUserByEmail: 'SELECT * FROM users WHERE email = ?',
    insertUser: 'INSERT INTO users SET ?',
    updateUserPassword: 'UPDATE users SET password = ? WHERE email = ?',
    findUserByMobile: 'SELECT * FROM users WHERE mobile = ?',
    insertOTP: 'UPDATE users SET otp = ?, otp_expiry = ? WHERE mobile = ?',
    verifyOTP: 'SELECT * FROM users WHERE mobile = ? AND otp = ? AND otp_expiry > ?',
    register:'SELECT email, mobile FROM users WHERE email = ? OR mobile = ?',
    saveToken:'UPDATE users SET token = ? WHERE id = ?',
    setTokenNull:'UPDATE users SET token = NULL WHERE id = ?',
};
