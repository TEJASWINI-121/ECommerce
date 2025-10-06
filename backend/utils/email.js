import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL || user;

let transporter = null;
if (host && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
} else {
  console.warn('SMTP not configured — emails will be logged instead of sent.');
}

export const sendOrderEmail = async ({ to, orderId, totalPrice }) => {
  const subject = `Order ${orderId} placed`;
  const text = `Thank you! Your order ${orderId} has been placed. Total: ${totalPrice}`;
  if (!transporter) {
    console.log(`Email (mock) to ${to} — ${subject}\n${text}`);
    return;
  }
  return transporter.sendMail({ from, to, subject, text });
};