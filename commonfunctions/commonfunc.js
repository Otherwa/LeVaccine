// connection string
const { connect } = require('../config/connect');

// jwt
const jwt = require('jsonwebtoken');

// nodemailer
var htmlcontent = require('../config/connection_config').htmlcontent
var htmlcontent1 = require('../config/connection_config').htmlcontent1

// mail service
const Nodemailer = require('nodemailer');//mailOptions
// news fetch
const fetch = require('node-fetch');//for fetch api




// passport authentication for username and password by passport

const session = require('express-session');
const bcrypt = require('bcrypt')

// email config
var transporter = Nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: require('../config/connection_config').email,
        pass: require('../config/connection_config').pass
    }
});


// send signup email
function sendSignupEmail(email) {

    var mailOptions = {
        from: 'levaccine69@gmail.com',
        to: email,
        subject: 'Thanks For Registering',
        text: 'Thanks For Registering',
        html: `
        <a href="http://levaccine.herokuapp.com/account/user/verify/`+ email + `">` + `Verify</a>
        <br>
        <p>Please Continue to Verify Your Account</p>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// mail service for subscription
function sendmail(email) {

    var mailOptions = {
        from: 'levaccine69@gmail.com',
        to: email,
        subject: 'Thanks For Subscribing to us',
        text: 'Thanks For Subscribing to us',
        html: htmlcontent
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// home page
function sendnews() {
    let data = fetch('https://newsapi.org/v2/everything?q=(Vaccines OR Medical)&pageSize=6&sortBy=publishedAt&language=en&apiKey=550660667a8646b08d2de09b578f1aa6')
        .then((response) => response.json())
        .then(data => {
            // do some stuff
            return data;
        })
        .catch(error => {
            return error;
        });

    return data;
}

// news education
function sendedunews() {
    let data = fetch('https://newsapi.org/v2/everything?q=medical&pageSize=3&sortBy=publishedAt&language=en&apiKey=550660667a8646b08d2de09b578f1aa6')
        .then((response) => response.json())
        .then(data => {
            // do some stuff
            return data;
        })
        .catch(error => {
            return error;
        });

    return data;
}

//midleware functions
//middleware auth function verify and set a web token 
async function auth(req, res, next) {
    const cookie = req.cookies.jwt
    console.log(cookie)
    if (cookie != undefined) {
        await jwt.verify(cookie, require('../config/connection_config').jwt_token, (err, result) => {
            if (err) return res.json({ msg: err.message });
            req.user = result;
            console.log(req.user)
            next();
        })
    } else {
        return res.redirect('/account/user/login');
    }
}

async function isauth(req, res, next) {
    const cookie = req.cookies.jwt
    console.log(cookie + "undified cookie")
    if (cookie != undefined) {
        await jwt.verify(cookie, require('../config/connection_config').jwt_token, (err, result) => {
            if (err) return res.json({ msg: err.message });
            req.user = result;
            console.log(req.user)
            return res.redirect('/account/user/dash');
        })
    } else {
        next();
    }
}

module.exports = { sendmail, session, sendnews, sendedunews, sendSignupEmail, jwt, bcrypt, auth, isauth }