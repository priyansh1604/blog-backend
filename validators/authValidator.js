const Joi = require('joi');
const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 50 characters',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        }),
    mobile: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.empty': 'Mobile number is required',
            'string.pattern.base': 'Mobile number must be a valid 10-digit number',
        }),
    password: Joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password cannot exceed 128 characters',
        }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .custom((value, helper) => {
            const isEmail = /\S+@\S+\.\S+/.test(value);
            const isMobile = /^\d{10}$/.test(value);

            if (!isEmail && !isMobile) {
                return helper.message('Email must be a valid email or 10-digit mobile number');
            }
            return value;
        }),
    password: Joi.string()
        .required()
        .min(6)
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
});


module.exports = { registerSchema, loginSchema };
