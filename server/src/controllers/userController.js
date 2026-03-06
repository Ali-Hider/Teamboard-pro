const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");

const addUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "manager", "member").required(),
});

const setPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const addUser = async (req, res, next) => {
  try {

    const { error } = addUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const inviteToken = crypto.randomBytes(20).toString("hex");
    const tempPassword = crypto.randomBytes(8).toString("hex");

    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role,
      companyId: req.user.companyId,
      inviteToken,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

    await sendEmail({
      to: email,
      subject: "You're invited to join TeamBoard Pro",
      html: `<p>Hi ${name}, click here to join: <a href="${inviteLink}">Set Password</a></p>`,
    });

    res.status(201).json({
      message: "User invited successfully",
      user,
    });

  } catch (error) {
    next(error);
  }
};

const setPassword = async (req, res, next) => {
  try {

    const { error } = setPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token, password } = req.body;

    const user = await User.findOne({ inviteToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.password = password;
    user.inviteToken = undefined;

    await user.save();

    res.json({ message: "Password set successfully" });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  setPassword,
};