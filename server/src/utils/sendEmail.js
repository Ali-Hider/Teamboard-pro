// src/utils/sendEmail.js
const { Resend } = require("resend");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY in .env");
  }

  const resend = new Resend(process.env.RESEND_API_KEY); // now it reads the env variable at runtime

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
