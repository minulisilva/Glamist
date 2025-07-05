import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-brevo.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendLowStockEmail = async (product) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Low Stock Alert',
      text: `Product "${product.name}" in category "${product.category || 'Uncategorized'}" is low on stock: ${product.quantity} units remaining. Please reorder.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low stock email sent for ${product.name}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending low stock email for ${product.name}:`, error);
    return { success: false, message: error.message };
  }
};