const Company = require("../models/Company");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    // 0/ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 1. Create Company
    const company = await Company.create({
      name: companyName,
    });

    // 2. Create Admin User
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
      companyId: company._id,
    });

    // 3. Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        companyId: company._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Company registered successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("companyId");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
