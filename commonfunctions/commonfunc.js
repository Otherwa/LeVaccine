// connection string
const { connect } = require('../config/connect');
// models for docs0
const usersSchema = require('../models/userschema');

// nodemailer
htmlcontent = require('../config/connection_config').htmlcontent
htmlcontent1 = require('../config/connection_config').htmlcontent1

// mail service
const Nodemailer = require('nodemailer');//mailOptions
// news fetch
const fetch = require('node-fetch');//for fetch api



// passport authentication for username and password by passport
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy;

// send signup email
function sendSignupEmail(email) {
    var transporter = Nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: require('../config/connection_config').email,
            pass: require('../config/connection_config').pass
        }
    });

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

// mail service
function sendmail(email) {
    // console.log(email)
    var transporter = Nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: require('../config/connection_config').email,
            pass: require('../config/connection_config').pass
        }
    });

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


//pasport module for user verification
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    usersSchema.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new localStrategy(async function (username, password, done) {
    await connect();
    usersSchema.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return done(err);
            if (res === false) return done(null, false, { message: 'Incorrect password.' });
            // console.log(user);
            return done(null, user);
        });
    });
}));

function authenticationmiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/account/user/login');
    }
}

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) { return next(); }
    else {
        res.redirect('/account/user/dash');
    }
}


module.exports = { sendmail, session, sendnews, sendedunews, passport, authenticationmiddleware, sendSignupEmail, isLoggedOut, bcrypt }