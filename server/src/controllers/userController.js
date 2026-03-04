const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); // You will create this

// POST /api/users - Admin adds a user (invite)
exports.addUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Generate temporary token for invite
    const inviteToken = crypto.randomBytes(20).toString("hex");

    // 3. Create user with temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const user = await User.create({
      name,
      email,
      password: tempPassword, // will be hashed automatically by User schema
      role,
      companyId: req.user.companyId, // tied to admin's company
      inviteToken, // store token to validate later
    });

    // 4. Send HTML invite email
    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;
    await sendEmail({
      to: email,
      subject: "You're invited to join TeamBoard Pro",
      html: `
        <h2>Welcome to TeamBoard Pro</h2>
        <p>Hi ${name},</p>
        <p>Click the button below to set your password and join your company:</p>
        <a href="${inviteLink}" style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Set Password</a>
        <p>If you didn't expect this invitation, you can ignore this email.</p>
      `,
    });

    res.status(201).json({
      message: "User invited successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
