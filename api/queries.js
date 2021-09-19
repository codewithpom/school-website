const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const functions = require("../test");
const fs = require('fs');
const crypto = require("crypto");
const app = express.Router();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/add_query", ((req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    const school_id = req.body['id'];
    const query = req.body['query'];
    const correct_cred = functions.login(email, password);
    if (email === undefined || password === undefined){
        res.redirect("/login");
        return ;
    }

    if (school_id === undefined || query === undefined){
        res.send("Wrong Form Body");
        return ;
    }

    if (!correct_cred) {
        res.clearCookie("email");
        res.clearCookie("password");
        res.redirect("/");
        return ;
    }


    let schools_owned;
    let file_data;
    try {
        file_data = JSON.parse(fs.readFileSync(`data/user-data/${email}.json`).toString())
    }catch (e) {
        res.send("Wrong school Id");
        return;
    }

    schools_owned = file_data['schools_owner'];
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
    if (!schools_owned.includes(school_id)){
        schools_owned = file_data['schools_in'];

        if (!schools_owned.includes(school_id)){
            res.send("You are not authorized");
            return;
        }

    }

    if (!file_data.includes("queries")){
        file_data['queries'] = []
    }

    const date_object= new Date()
    file_data['queries'].push({
        "Name": JSON.parse(fs.readFileSync(`data/usernames.json`).toString())[email],
        "Time": date_object.toString(),
        "Text": query
    })

}))


