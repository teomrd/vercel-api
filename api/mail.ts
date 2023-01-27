import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '../middleware/allowCors';

const myMail = process.env.MY_MAIL;
const myName = process.env.MY_NAME;
const pass = process.env.MIROPAD_APPLE_APP_SPECIFIC_PASSWORD;

const authorize = (request: VercelRequest, response: VercelResponse) => {
  if (request.headers['x-secret-token'] !== process.env.MIROPAD_SECRET_TOKEN) {
    return response.status(401).json({
      error: {
        message: 'You are unauthorized to access this resource!',
      },
    });
  }
};

const mail = async ({
  to, subject, html, text = '',
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: myMail,
      pass,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${myName}" <${myMail}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const {
    to, subject, html, text,
  } = request.body;

  authorize(request, response);

  await mail({
    to, subject, html, text,
  });

  return response.status(200).json({
    status: 'ok',
    message: 'mail sent 📧',
  });
}

export default allowCors(handler);