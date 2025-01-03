const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role, restaurant_name, address } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let finalRestaurantId =  '' ;

    if (role === "owner") {
      const newRestaurant = new Restaurant({
        name: restaurant_name,
        address: address, 
        owner_id: null, 
        subscription: { plan: "Free", start_date: new Date() },
      });
      const savedRestaurant = await newRestaurant.save();
      finalRestaurantId = savedRestaurant._id;
    }

    const newUser = new User({
      name : name || restaurant_name,
      email,
      password: hashedPassword,
      role,
      restaurant_id: role === "owner" ? finalRestaurantId : null,
    });
    const savedUser = await newUser.save();

    if (role === "owner") {
      await Restaurant.findByIdAndUpdate(finalRestaurantId, {
        owner_id: savedUser._id,
      });
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success : true,
      message: "User registered successfully",
      token, 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate a token with 7-day expiry
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success : true,
      message: "Login successful",
      token, // Send token in response
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, // Optionally send user details
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
