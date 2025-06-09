const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmation = async (to, order) => {
  const mailOptions = {
    from: '"UtilityBay" <no-reply@utilitybay.in>',
    to,
    subject: `🧾 Order Confirmation - ${order.order_id}`,
    html: `<h2>Thanks for your order, ${order.name}!</h2>
           <p>Order ID: ${order.order_id}</p>
           <p>Total Amount: ₹${order.total_amount}</p>
           <p>Status: ${order.status}</p>
           <p>We’ll notify you when it's shipped.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmation };
