const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = '7d'; 
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

exports.register = async (req, res) => {
    const { email, username } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            if (existingUser.username === username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        const salt = await bcrypt.genSalt(10);// Generate salt for hashing password 10 ký tự
        const hashedPassword = await bcrypt.hash(req.body.password, salt);// Hash the password using bcrypt

        const userData = { ...req.body, password: hashedPassword };
        const newUser = new User(userData);
        const user = await newUser.save();
        
        // Generate token
        const token = generateToken(user._id);
        // Return user data and token
        res.status(201).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const token = generateToken(user._id);
        res.json({ success: true, token, user });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Verify token (middleware)
exports.verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user id to request
        req.user = { id: decoded.id };

        next();

    } catch (error) {
        console.error('Token verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error verifying token',
            error: error.message
        });
    }
};
