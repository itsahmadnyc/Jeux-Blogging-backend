const { User } = require("../models");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../services/emailService");

const notifyAllSubscribersAndUsers = async (blogTitle) => {
    const subscribers = await Subscriber.findAll();
    const users = await User.findAll({ where: { role: 'user' } });

    console.log("Subscriber and User", subscribers,users )
  
    const allEmails = [
      ...new Set([
        ...subscribers.map(s => s.email),
        ...users.map(u => u.email)
      ])
    ];
  
    console.log("Sending emails for blog:", blogTitle);


    const subject = `New Blog Published: ${blogTitle}`;
    const message = `Hi,\n\nA new blog titled "${blogTitle}" has been published on Jeux.\n\nVisit our site to read it.\n\nBest,\nJeux Developer Team`;
    const html = `
      <p>Hi,</p>
      <p>A new blog titled <strong>${blogTitle}</strong> has been published on <strong>Jeux</strong>.</p>
      <p><a href="https://jeuxdeveloper.com">Click here to read it</a></p>
      <br/>
      <p>Best,<br/>Jeux Developer Team</p>
    `;
  
    for (const email of allEmails) {
      await sendEmail(email, subject, message, html);
    }
  };

  module.exports = notifyAllSubscribersAndUsers;
  