const { User } = require("../models");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("../services/emailService");

const notifyAllSubscribersAndUsers = async (blogTitle) => {
    const subscribers = await Subscriber.findAll();
    const users = await User.findAll({ where: { role: 'user' } });

  
    const allEmails = [
      ...new Set([
        ...subscribers.map(s => s.email),
        ...users.map(u => u.email)
      ])
    ];
  
    console.log("Sending emails to all Users and Subscribers:");


    const subject = `New Blog Published: ${blogTitle}`;



// Plain text version
const message = `Hi there,\n\nWe're excited to share our latest blog post: "${blogTitle}"\n\nRead it now: https://jeux-web.vercel.app/\n\nBest,\nJeux Developer Team\n\nUnsubscribe: [UNSUBSCRIBE_LINK]`;

// HTML template
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        /* Reset styles */
        body { margin: 0; padding: 0; min-width: 100%; font-family: Arial, sans-serif; }
        table { border-spacing: 0; }
        td { padding: 0; }
        img { border: 0; max-width: 100%; }
    </style>
</head>
<body style="background-color: #f7f7f7;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                <!-- Main Container -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 25px; background-color: #2A2A2A; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; text-align: center;">Jeux Blog Update</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <p style="margin: 0 0 20px 0; color: #444444; line-height: 1.6;">Hi there,</p>
                            <p style="margin: 0 0 20px 0; color: #444444; line-height: 1.6;">We're excited to share our latest blog post:</p>
                            
                            <h2 style="margin: 0 0 25px 0; color: #2A2A2A; font-size: 20px; text-align: center;">${blogTitle}</h2>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="https://jeux-web.vercel.app/" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">Read Now →</a>
                            </div>
                            
                            <p style="margin: 25px 0 0 0; color: #777777; font-size: 14px; text-align: center;">
                                Can't see the button? <a href="https://jeux-web.vercel.app/" style="color: #007bff; text-decoration: none;">Click here to view the post</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 25px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.5;">
                                            Sent by Jeux Developer Team<br>
                                            <a href="https://jeux-web.vercel.app/" style="color: #007bff; text-decoration: none;">Visit our website</a> | 
                                            <a href="[UNSUBSCRIBE_LINK]" style="color: #007bff; text-decoration: none;">Unsubscribe</a>
                                        </p>
                                        <p style="margin: 15px 0 0 0; color: #6c757d; font-size: 12px;">
                                            © ${new Date().getFullYear()} Jeux. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;


    // const message = `Hi,\n\nA new blog titled "${blogTitle}" has been published on Jeux.\n\nVisit our site to read it.\n\nBest,\nJeux Developer Team`;
    // const html = `
    //   <p>Hi,</p>
    //   <p>A new blog titled <strong>${blogTitle}</strong> has been published on <strong>Jeux</strong>.</p>
    //   <p><a href="https://jeux-web.vercel.app/">Click here to read it</a></p>
    //   <br/>
    //   <p>Best,<br/>Jeux Developer Team</p>
    // `;
  
    for (const email of allEmails) {
      await sendEmail(email, subject, message, html);
    }
  };

  module.exports = notifyAllSubscribersAndUsers;
  