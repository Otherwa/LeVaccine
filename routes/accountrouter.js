const express = require('express');
const Router = express.Router();
const { connect } = require('../config/connect');
const { userSchema } = require('../models/methods/user_meth');
const { sendSignupEmail, bcrypt, auth, isauth, livedata } = require('../commonfunctions/commonfunc');

// implemented usermodel added methods in prototype and create a instanceof user
var user = new userSchema();

// index
Router.get('/', (err, res) => {
    res.status(200).render('account/whichlogin')
})

// user
Router.get('/user', (req, res) => {
    res.status(200).render('account/user')
})

// account creation
Router.get('/user/signup', (req, res) => {
    res.status(200).render('account/user/signup')
})


// if creation successfull
Router.post('/user/signup', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    await user.signup(req, res, username, email, password)
})

//auth in common functions
// account login
Router.get('/user/login', isauth, (req, res) => {
    res.render('account/user/login', { err: req.flash('message'), err1: req.flash('user') });
})


// if login is successful
Router.post('/user/login', async (req, res) => {
    // user login
    const username = req.body.username;
    const password = req.body.password;
    // to check if login exisit
    user.login(req, res, username, password);
})

// all middleware functions in common
Router.get('/user/dash', auth, livedata, async (req, res) => {
    // token set or

    await connect();
    const count = await userSchema.count();

    const cookie = req.cookies.jwt;
    // get req user
    console.log(req.user);
    res.render('account/user/dashboard', { data: req.user, token: cookie, count: count });
});


Router.get('/user/logout', async (req, res) => {
    user.logout(req, res);
});

// email verification
Router.get('/user/verify/:email', async (req, res) => {
    var email = req.params.email;
    await connect();
    console.log(email)

    var exsist = await userSchema.findOne({ email: email });

    if (exsist === null) {
        res.json({ msg: "no user" })
    }
    else {
        if (exsist.verified === false) {
            const filter = { email: email };
            const update = { $set: { verified: true } };

            userSchema.findOneAndUpdate(filter, update, (err, result) => {
                if (err) {
                    res.json(err)
                }
                else {
                    res.json({ msg: "verifed redirecting any minute", res: result })
                }
            });
        } else {
            res.json({ msg: "already verified" })
        }
    }
});
// producer
Router.get('/producer', (req, res) => {
    res.render('account/producer')
})


// provider
Router.get('/provider', (req, res) => {
    res.render('account/provider')
})

//error custom
Router.get("*", (req, res) => {
    res.render('error')
})

module.exports = { Router, auth };
