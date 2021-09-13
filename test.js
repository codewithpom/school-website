const fs = require('fs');
const mailer = require("./email_test")
const crypto = require("crypto");

export function isEmailValid(email) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if(email.length>254)
        return false;

    const valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    const parts = email.split("@");
    if(parts[0].length>64)
        return false;

    const domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
export function username_exists(username) {
    const usernames = JSON.parse(fs.readFileSync("data/usernames.json"));
    if (username in Object.values(usernames)) {
        return false;
    } else {
        return true;
    }
}

export function email_taken(email) {
    const emails = Object.keys(JSON.parse(fs.readFileSync("data/usernames.json").toString()));
    if (email in emails) {
        return false;
    }
}


export function create_account(username, password, email) {
    const username_exists_or_not = username_exists(username);
    if (username_exists_or_not) {
        return false;
    } else {
        if (email_taken(email)) {
            return false;
        } else {
            const id = crypto.randomBytes(20).toString('hex');
            const data = fs.readFileSync("data/codes.json");
            data['items'].push({
                "code": id,
                "email": email,
                "username": username,
                "password": password
            });
            mailer.send_email(email, code);
            fs.writeFileSync("data/codes.json", JSON.stringify(data));
            return true;
        };
    };

};


export function verify(code) {
    const codes_data = JSON.parse(fs.readFileSync("data/codes.json"));
    for (const iterator of codes_data['items']) {
        if (iterator['code'] == code) {
            return true;
        } else {
            continue;
        }
    }
    return false;



};


export function login(email, password) {
    const accounts = JSON.parse(fs.readFileSync("data/accounts.json"));
    if (accounts[email] === password) {
        return true;
    } else {
        return false;
    };

};

