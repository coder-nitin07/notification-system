const mailgun = require('mailgun-js');
const dotenv = require('dotenv');

dotenv.config();  // Loads .env variables

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

// Updated sendEmail function with correct 'from' email for Mailgun sandbox domain
const sendEmail = (to, subject, text, html) => {
  const data = {
    from: 'postmaster@sandbox739836cc694a4f40946a6e325750d279.mailgun.org',  // Sandbox 'from' email
    to, 
    subject,
    text,
    html,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', body);
    }
  });
};

module.exports = sendEmail;