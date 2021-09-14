const express = require("express");
const bodyParser = require('body-parser');
const functions = require("./test");
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
    const email = req.cookies['email'];
    const password = req.cookies['password'];
    if (email != undefined && password != undefined) {
        let correct_credentials = functions.login(email, password);
        console.log(correct_credentials);
        if (correct_credentials) {
            res.redirect(202, "/me");

        } else {
            res.clearCookie("email");
            res.clearCookie("password");
            res.sendFile(__dirname + "/templates/login.html")
        }
    } else{
        res.sendFile(__dirname + "/templates/login.html");
    }

});


app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    console.log(password)
    if (email === undefined && password === undefined) {
        res.send("Wrong Form Body");
    }
    let correct_credentials = functions.login(email, password);
    if (correct_credentials) {
        res.cookie("email", email);
        res.cookie("password", password);
        res.redirect(202, "/create");

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
    console.log(email);
    console.log(password);
    console.log(username);
    if (username === email === password === undefined) {
        res.send("Wrong Form body");
    }
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


app.listen(80, () => {
    console.log(`Server started on port 80`);
    
})
