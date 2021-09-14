const fs = require('fs');
const mailer = require("./email_test")
const crypto = require("crypto");
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

function isEmailValid(email) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    const valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    const parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    const domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
}

function username_exists(username) {
    const usernames = JSON.parse(fs.readFileSync("data/usernames.json"));
    if (username in Object.values(usernames)) {
        return true;
    } else {
        return false;
    }
}

function email_taken(email) {
    const emails = Object.keys(JSON.parse(fs.readFileSync("data/usernames.json").toString()));
    if (email in emails) {
        return true;
    }
    return false;
}


function create_account(username, password, email) {
    const username_exists_or_not = username_exists(username);
    if (username_exists_or_not) {
        return false;
    } else {
        if (email_taken(email)) {
            return false;
        } else {
            const id = String(crypto.randomBytes(20).toString('hex'));
            const data = JSON.parse(fs.readFileSync("data/codes.json"));
            data['items'].push({
                "code": id,
                "email": email,
                "username": username,
                "password": password
            });

            const mailOptions = {
                from: 'padmashreejha717@gmail.com',
                to: email,
                subject: 'Verification Code',
                text: `This is the verification link for Books ${id} click on it to verify your account`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            console.log("Sent email")
            fs.writeFileSync("data/codes.json", JSON.stringify(data));
            return true;
        };
    };

};


function verify(code) {
    let codes_data = JSON.parse(fs.readFileSync("data/codes.json"));
    let iterator;
    for (const index in codes_data['items']) {
        iterator = codes_data['items'][index];
        if (iterator['code'] == code) {
            delete codes_data['items'][index];

            fs.writeFileSync("data/codes.json", JSON.stringify(codes_data['items'].filter(x => x !== null)));
            return iterator;
        } else {
            continue;
        }
    }
    return false;



};


function login(email, password) {
    const accounts = JSON.parse(fs.readFileSync("data/accounts.json"));
    if (accounts[email] === password) {
        return true;
    } else {
        return false;
    };

};

module.exports.login = login;
module.exports.verify = verify;
module.exports.create_account = create_account;
module.exports.email_taken = email_taken;
module.exports.username_exists = username_exists;
module.exports.isEmailValid = isEmailValid;
