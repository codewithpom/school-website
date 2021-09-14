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

function send_email(email, code) {

}


module.exports.send_email = send_email;
