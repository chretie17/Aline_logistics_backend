const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use any other email provider
  auth: {
    user: 'uwinezaline27@gmail.com', // Replace with your email
    pass: 'xlmq ieye baaj mpna',   
  },
});

exports.sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: '"Bspecial business ltd" <your-email@example.com>', // Sender address
      to, // Recipient email address
      subject, // Subject of the email
      text, // Plain text version of the email
      html, // HTML version of the email
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
