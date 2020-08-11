'use strict';
const nodeMailer = require('nodemailer');

module.exports = function(email, link) {
  let body_html;

  body_html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Reset Password</title>
    </head>
    <body
      style="text-align: center;font-family: Verdana, Geneva, Tahoma, sans-serif;"
    >
      
      <div>
        <h1 style="color: #000000;">A Message from <span style="color: #a2a2a2;">DSYA Academy</span></h1>
        <h4
          style="font-weight: 100; font-size: 20px; margin-top:10px; margin-bottom:10px; color: #000000;"
        >
          A request was made to reset your password.
        </h4>
        <h4
          style="font-weight: 100; font-size: 20px; margin-top:10px; margin-bottom:10px; color: #000000;"
        >
          Click on the button below to reset your password...
        </h4>
        <br />
        <a href="${link}">
          <button
            style="position: relative;width: 250px;height: 50px;font-size: 20px;cursor: pointer;border: 3px solid #000000 ;background-color: white; color: #000000;border-radius: 9px;"
          >
            Reset Password
          </button>
        </a>
      </div>
    </body>
  </html>
  `;

  // send grid smtp sending.
  let transporter = nodeMailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDGRIDUSERNAME,
      pass: process.env.SENDGRIDKEY,
    },
  });
  let mailOptions = {
    from: '"Reset Link" <dsyareset@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: `password reset`, // Subject line
    text: `password reset.`, // plain text body
    html: body_html, // html body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });
};