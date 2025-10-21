// utils/email.cjs
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Student Leave System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(" Email sent: ", info.messageId);
  } catch (error) {
    console.error(" Failed to send email: ", error);
  }
}

module.exports = sendEmail;
