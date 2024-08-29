const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    isActivated: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route to handle signup
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newUser = new User({ email, username, password, otp });
        await newUser.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending OTP', success: false });
            }
            res.status(200).json({ message: 'OTP sent successfully', success: true });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to verify OTP and create account
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist', success: false });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP', success: false });
        }

        // Activate user account
        user.isActivated = true;
        await user.save();

        res.status(200).json({ message: 'Account activated successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle sign-in
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist', success: false });
        }

        if (!user.isActivated) {
            return res.status(400).json({ message: 'Account not activated', success: false });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password', success: false });
        }

        res.status(200).json({ message: 'Sign in successful', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
