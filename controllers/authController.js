const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Generate a token with 7-day expiry
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ 
            message: "User registered successfully",
            token, // Send token in response
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } // Optionally send user details
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate a token with 7-day expiry
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful",
            token, // Send token in response
            user: { id: user._id, name: user.name, email: user.email, role: user.role } // Optionally send user details
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
