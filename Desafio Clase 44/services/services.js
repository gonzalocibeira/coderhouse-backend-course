import { createTransport } from "nodemailer";
import twilio from "twilio";

const sendMail = async (req, type = "newUser", subject = "New user registered", items) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kariane30@ethereal.email',
            pass: 'eJ9Nk6gDxqZN2G1c2B'
        }
    });
  
    const adminMail = "turcoturco95@gmail.com";

    let mailBody = "";
    switch (type) {
        case "newUser":
            mailBody = `<p>New user with mail:${req.body.email}, name:${req.body.name}, address:${req.body.address}, age:${req.body.age} and phone:${req.body.phone}</p>`;
            break;
        case "purchase":
            mailBody = `<p>New purchase from user ${req.user.username}, details:${items}</p>`;
            break;
    };

    const mailOtions = {
    from: "Node Server",
    to: adminMail,
    subject,
    html: mailBody
    };

    try {
    transporter.sendMail(mailOtions);
    }
    catch (err) {
    logger.info("Failed to send mail");
    }
};

const sendSMS = async (req, message) => {
    const accountSid = process.env.TWILIOSSID;
    const authToken = process.env.TWILIOAUTH;
    
    const client = twilio(accountSid, authToken);

    const options = {
        body: message,
        from: "+15178365226",
        to: req.user.phone,
      };
      
      try {
        const message = await client.messages.create(options);
      } catch (err) {
        logger.warn(err);
      }
};

export { sendMail, sendSMS };