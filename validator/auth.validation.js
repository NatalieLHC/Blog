import Joi from 'joi';

const registrationSchema = Joi.object({
    name: Joi.string().required().min(3).max(30).messages({
        'any.required': 'Username is required',
    }),
    password: Joi.string().required().min(6).messages({
        'any.required': 'Password is required',
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
    }),
})

const loginSchema = Joi.object({
    email: Joi.string().required().email().messages({
        'any.required': 'Email is required',
    })
    ,
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    })
})

export { registrationSchema, loginSchema };