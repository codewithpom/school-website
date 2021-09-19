const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const functions = require("../test");
const fs = require('fs');
const webhook = require("webhook-discord");
const crypto = require("crypto");
const app = express.Router();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

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

app.post("/create_school", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_name = req.body['name'];
    if (school_name === undefined) {
        res.send("Wrong Body");
        return;
    }

    if (email !== undefined && password !== undefined) {
        let correct_credentials = functions.login(email, password);
        console.log(correct_credentials);

        if (correct_credentials) {
            console.log("Credentials")
            const schools = JSON.parse(fs.readFileSync("data/schools.json").toString());
            if (Object.values(schools).includes(school_name)) {
                res.send("This name is taken please try another name");
                return;
            }

            let school_code = String(crypto.randomBytes(4).toString('hex'));
            while (true) {
                if (Object.keys(schools).includes(school_code)) {
                    console.log("Repeating");
                    school_code = String(crypto.randomBytes(4).toString('hex'));
                    continue;
                }
                break;
            }
            console.log("Test 1");
            schools[school_code] = school_name;
            fs.writeFileSync("data/schools.json", JSON.stringify(schools));

            const data = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString());
            data['schools_owner'].push(school_code)
            fs.writeFileSync(`data/user-data/${email}.json`, JSON.stringify(data));
            fs.writeFileSync(`data/school-data/${school_code}.json`, JSON.stringify({
                "students": [],
                "announcements": [],
                "announcements_webhook": []
            }));

            console.log("Test 2");
            res.send(school_code);

        } else {
            res.clearCookie("email");
            res.clearCookie("password");
            res.redirect("/login")
        }
    } else {
        res.redirect("/login");
    }
}))


app.get("/join_school", ((req, res) => {
    const school_id = req.query.id;
    const email = req.cookies['email']
    const password = req.cookies['password'];

    if (email === undefined || password === undefined) {
        console.log("Cookies not set")
        res.sendFile(__dirname + "/templates/user.html");
        return;
    }

    const correct_credentials = functions.login(email, password);
    console.log(correct_credentials);
    if (!correct_credentials) {
        console.log("Wrong Credential");
        res.clearCookie("email");
        res.clearCookie("password");
        res.sendFile(__dirname + "/templates/user.html");
        return;
    }

    console.log("Test");
    if (!Object.keys(JSON.parse(fs.readFileSync("data/schools.json").toString())).includes(school_id)) {
        res.send("Wrong School ID");
        return;
    }
    console.log("Test 2");
    let user_data = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString());

    if (user_data['school_in'].includes(school_id)) {
        res.send("You are already in that school");
        return;
    }
    const school_data = JSON.parse(fs.readFileSync(`data/school-data/${school_id}.json`).toString());
    school_data['students'].push(JSON.parse(fs.readFileSync("data/usernames.json").toString())[email]);
    fs.writeFileSync(`data/school-data/${school_id}.json`, JSON.stringify(school_data));
    user_data['school_in'].push(school_id);
    fs.writeFileSync(`data/user-data/${email}.json`, JSON.stringify(user_data));
    res.redirect('/');
    console.log("Test 3");

}));

app.post("/create_announcement", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_id = req.body['id'];
    const announcement = req.body['announcement'];
    const correct_cred = functions.login(email, password);
    console.log(email)
    if (email === undefined || password === undefined) {
        res.redirect("/login");
        return;
    }

    if (school_id === undefined || announcement === undefined) {
        res.send("Wrong Form Body");
        return;
    }

    if (!correct_cred) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.redirect("/");
        return;
    }

    const school_name = JSON.parse(fs.readFileSync(`data/schools.json`).toString())[school_id]
    if (school_name === undefined) {
        res.send("Wrong ID");
        return;
    }

    let schools_owned;

    try {
        schools_owned = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString())['schools_owner'];
    } catch (e) {
        res.send("You are not authorized");
        res.end();
        return;
    }

    if (!schools_owned.includes(school_id)) {
        res.send("You are not authorized");
        return;
    }

    const date_object = new Date()
    const school_data = JSON.parse(fs.readFileSync(`data/school-data/${school_id}.json`).toString())
    let school_code = String(crypto.randomBytes(50).toString('hex'));
    school_data['announcements'].push({
        "content": announcement,
        "date": date_object.toString(),
        "code": school_code
    })

    fs.writeFileSync(`data/school-data/${school_id}.json`, JSON.stringify(school_data));
    res.send("Done");
    const username_data = JSON.parse(fs.readFileSync(`data/usernames.json`).toString())

    for (let schoolDatum of school_data['students']) {
        const email = getKeyByValue(username_data, schoolDatum);
        const mailOptions = {
            from: 'padmashreejha717@gmail.com',
            to: email,
            subject: 'New announcement',
            html: `Your new school has been made a new announcements <b>${school_name}</b><br><br>${announcement}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }
    let hook;

    for (let schoolDatum of school_data['announcements_webhook']) {
        hook = new webhook.Webhook(schoolDatum['url']);
        hook.info(
            schoolDatum['name'], `Your School **${school_name}** has made a new **Announcement**\n**${announcement}**`
        )
    }
    console.log("Still Running");

}))


app.post("/total_announcements", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_id = req.body['id'];

    const correct_cred = functions.login(email, password);
    if (email === undefined || password === undefined) {
        res.redirect("/login");
        return;
    }

    if (school_id === undefined) {
        res.send("Wrong Form Body");
        return;
    }

    if (!correct_cred) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.redirect("/");
        return;
    }


    let schools_owned;
    const file_data = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString())
    console.log(file_data);
    schools_owned = file_data['schools_owner'];
    console.log(schools_owned);
    if (schools_owned.length === 0) {
        schools_owned = file_data['school_in'];
        try {
            if (!schools_owned.includes(school_id)) {
                res.send("You are not authorized");
                return;
            }
        } catch (e) {
            res.send("You are not authorized");
            return;

        }
    }
    if (!schools_owned.includes(school_id)) {
        schools_owned = file_data['schools_in'];

        if (!schools_owned.includes(school_id)) {
            res.send("You are not authorized");
            return;
        }

    }


    const total_announcements = JSON.parse(fs.readFileSync(`data/school-data/${school_id}.json`).toString());

    res.json(total_announcements['announcements']);
}))


app.post("/delete_announcements", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_id = req.body['id'];
    const announcement = req.body['announcement_id'];
    const correct_cred = functions.login(email, password);

    console.log(email)

    if (email === undefined || password === undefined) {
        res.redirect("/login");
        return;
    }

    if (school_id === undefined || announcement === undefined) {
        res.send("Wrong Form Body");
        return;
    }

    if (!correct_cred) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.redirect("/");
        return;
    }

    let schools_owned;

    try {
        schools_owned = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString())['schools_owner'];
    } catch (e) {
        res.send("You are not authorized");
        res.end();
        return;
    }
    try {
        if (!schools_owned.includes(school_id)) {
            res.send("You are not authorized");
            return;
        }
    } catch (e) {
        res.send("You are not authorized");
        return;
    }


    let announcements = JSON.parse(fs.readFileSync(`data/school-data/${school_id}.json`).toString());

    let success = false;
    for (let announcementsKey in announcements['announcements']) {
        if (announcements['announcements'][announcementsKey]['code'] === announcement) {

            announcements['announcements'].splice(announcementsKey, 1)
            fs.writeFileSync(`data/school-data/${school_id}.json`, JSON.stringify(announcements));
            success = true;
        }
    }

    if (success) {
        res.send("Done");
    } else {
        res.send("Wrong ID");
    }

}))

app.post("/webhook_announcements", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_id = req.body['id'];
    const url = req.body['url'];
    const name = req.body['name'];
    const correct_cred = functions.login(email, password);
    if (email === undefined || password === undefined) {
        res.redirect("/login");
        return;
    }

    if (school_id === undefined) {
        res.send("Wrong Form Body");
        return;
    }

    if (!correct_cred) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.redirect("/");
        return;
    }


    let schools_owned;
    const file_data = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString())
    console.log(file_data);
    schools_owned = file_data['schools_owner'];
    console.log(schools_owned);
    if (schools_owned.length === 0) {
        schools_owned = file_data['school_in'];
        try {
            if (!schools_owned.includes(school_id)) {
                res.send("You are not authorized");
                return;
            }
        } catch (e) {
            res.send("You are not authorized");
            return;

        }
    }
    if (!schools_owned.includes(school_id)) {
        schools_owned = file_data['schools_in'];

        if (!schools_owned.includes(school_id)) {
            res.send("You are not authorized");
            return;
        }

    }

    try {
        const Hook = new webhook.Webhook(url)

        Hook.info(name, `This is to **verify** this channel.`);
        const school_data = JSON.parse(fs.readFileSync(`data/school-data/${school_id}.json`).toString());
        school_data['announcements_webhook'].push({
            "url": url,
            "author": email,
            "name": name
        })

        fs.writeFileSync(`data/school-data/${school_id}.json`, JSON.stringify(school_data));

        res.send("Done");

    } catch (e) {
        res.status(404);
        res.send("Wrong URL")
    }

}))
module.exports = app;
