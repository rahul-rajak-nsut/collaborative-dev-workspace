const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({ username, email, password });

    generateToken(res, user._id);

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Same error message for both cases on purpose — don't reveal which part was wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res.status(200).json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route POST /api/auth/logout
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };