const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: "onboarding@resend.dev", // default test sender
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
