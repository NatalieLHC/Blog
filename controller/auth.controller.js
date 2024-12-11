import { registrationSchema, loginSchema } from "../validator/auth.validation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import models from "../models/index.js";  // Access models from the index.js
import dotenv from "dotenv";
dotenv.config();

const User = models.User;  // Access the User model from the db object

// Register User
const registerUser = async (req, res) => {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });  // Using `findOne` for single user lookup
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ name, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '20m'
        });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message || error
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '20m'
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message || error
        });
    }
};

// Middleware for validating registration data
const validateRegistration = (req, res, next) => {
    const { error } = registrationSchema.validate(req.body); // Use Joi to validate
    if (error) {
        return res.status(400).json({ message: error.details[0].message }); // Return error if validation fails
    }
    next(); // If valid, continue to the next middleware (registerUser)
};

// Middleware for validating login data
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body); // Use Joi to validate
    if (error) {
        return res.status(400).json({ message: error.details[0].message }); // Return error if validation fails
    }
    next(); // If valid, continue to the next middleware (loginUser)
};

export { registerUser, loginUser, validateLogin, validateRegistration };
