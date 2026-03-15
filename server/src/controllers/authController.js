const Company = require("../models/Company");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// validation schemas
const signupSchema = Joi.object({
  companyName: Joi.string().min(3).required(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.signup = async (req, res, next) => {
  try {

    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { companyName, name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const company = await Company.create({
      name: companyName,
    });

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
      companyId: company._id,
    });

    const token = jwt.sign(
      {
        id: user._id,
        companyId: company._id,
        role: user.role,
        name: user.name // include name in token for easy access on frontend
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Company registered successfully",
      token,
    });

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    next(error);
  }
};