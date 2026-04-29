const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { JWT_SECRET } = require("../config/env");
const User = require("../models/user.model");

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: user.role, email: user.email, userId: user._id },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Signup new user
async function createUser(newUser) {
  try {
    const { name, email, password, role } = newUser;

    if (!name || !email || !password || !role) {
      throw new Error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const validRoles = ["Admin", "Viewer"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User(newUser);
    const savedUser = await user.save();

    return savedUser;
  } catch (error) {
    throw error;
  }
}

router.post("/signup", async (req, res) => {
  try {
    const savedUser = await createUser(req.body);

    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
