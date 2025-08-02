const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html }) {
  // Configure your SMTP transporter here
  // Example: Gmail SMTP (for demo only, use environment variables in production)
  // Always use Ethereal for local development
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: 'jamel.huel2@ethereal.email', // Replace with your Ethereal user
      pass: 'g1YMjXY6B33UcQZ67x',            // Replace with your Ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject,
    html,
  });

  // For dev: log the preview URL
  if (process.env.NODE_ENV !== 'production') {
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
  }
  return info;
}

module.exports = sendEmail;
