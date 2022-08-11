const nodemailer = require("nodemailer");

async function sendMail({ from, to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "kumarshashikant05@gmail.com",
      pass: "KXfx8VzH6UavAwR3",
    },
  });

  let info = await transporter.sendMail({
    from: `inShare <${from}>`,
    to: to,
    subject,
    text,
    html,
  });
  console.log(info);
}
module.exports = sendMail;
