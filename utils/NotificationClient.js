const nodemailer = require("nodemailer");

const sendEmail = (emailsIds, subject, html, text) => {
  let output = "";

  emailsIds.forEach((email, i) => {
    if (i == 0) {
      output += email;
    } else {
      output += ", ";
      output += email;
    }
  });

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSCODE,
    },
  });

  let mailDetails = {
    from: "borntowindharma@gmail.com",
    to: emailsIds,
    subject: subject,
  };

  if (html) {
    mailDetails.html = html;
  }

  if (text) {
    mailDetails.text = text;
  }

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Unable to send email ", err);
    } else {
      console.log("Email sent sucessfully");
    }
  });
};

module.exports = {
  sendEmail,
};
