const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'padmashreejha717@gmail.com',
        pass: process.env.password
    }
});

function send_email(email, code){
    const mailOptions = {
        from: 'padmashreejha717@gmail.com',
        to: 'padmashreegithub@gmail.com',
        subject: 'Verification Code',
        text: `This is the verification link for Books ${code} click on it to verify your account`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


module.exports = send_email;
