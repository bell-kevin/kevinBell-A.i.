const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

function sendEmailNotification(message) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP variables not fully configured; skipping email notification');
    return;
  }
  transporter
    .sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'bellKevin@pm.me',
      subject: 'New chatbot message',
      text: `User said: ${message}`,
    })
    .catch((err) => {
      console.error('Failed to send email:', err);
    });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const userMessage = body.message;
  if (!userMessage) {
    return { statusCode: 400, body: JSON.stringify({ error: 'message field required' }) };
  }
  sendEmailNotification(userMessage);
  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
    });
    const reply = completion.choices[0].message.content.trim();
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to get response from OpenAI: ${err.message}`,
      }),
    };
  }
};
