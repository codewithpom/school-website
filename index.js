const express = require("express");
const bodyParser = require('body-parser');
const functions = require("./test");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    if (email != undefined && password != undefined) {
        let correct_credentials = functions.login(email);

        if (correct_credentials) {
            res.redirect("/me");

        } else {
            res.clearCookie("email");
            res.clearCookie("password");
        }
    } else{
        res.sendFile(__dirname + "/templates/login.html");
    }

});


app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let correct_credentials = functions.login(email, password);
    if (correct_credentials) {
        res.cookie("email", email);
        res.cookie("password", password);
        res.redirect("/me", 202);

    } else {
        res.send("Wrong Password or Account");
    }

});


app.get("/create", (req, res) => {
    res.sendFile(__dirname + "/templates/signup.html")
});

app.post("/create", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const username_exists = functions.username_exists(username);
    if (username_exists) {
        res.send("Username Already taken");
    } else {
        if (functions.isEmailValid(email)) {
            res.send("Email not correct");
        } else {
            if (functions.email_taken(email)) {
                res.send("Email Already taken by someone else");
            } else {
                functions.create_account(username, password, email);
                res.send("Verification link sent")
            }
        }        
    }

})



