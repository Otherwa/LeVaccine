const express = require('express');
const Router = express.Router();
const usersSchema = require('../models/userschema');
const { connect } = require('../config/connect');

const { passport, session, isLoggedIn, isLoggedOut, bcrypt } = require('../commonfunctions/commonfunc');

// for session management of user passport mo
// passport start
Router.use(session({
    secret: "verygoodsecret",
    resave: false,
    saveUninitialized: true
}));

//account session
Router.use(passport.initialize());
Router.use(passport.session());


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
    await connect();

    var username = req.body.username;
    var password = req.body.password;
    const exists = await usersSchema.exists({ username: username });
    if (exists) {
        res.redirect('/account/user/login');
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err);

            const newAdmin = new usersSchema({
                username: username,
                password: hash
            });

            newAdmin.save();
            res.redirect('/account/user/login');
        });
    });
})

// account login
Router.get('/user/login', isLoggedOut, (req, res) => {
    res.status(200).render('account/user/login')
})

// if login is successful
Router.post('/user/login', passport.authenticate('local', {
    successRedirect: '/account/user/dash',
    failureRedirect: '/account/user/login'
}))

Router.get('/user/dash', isLoggedIn, async (req, res) => {
    res.render('account/user/dashboard')
});

Router.get('/user/logout', function (req, res) {
    req.logout(function (err) {
        if (!err) {
            res.redirect('/account/user');
        }
    });
});

// producer
Router.get('/producer', (req, res) => {
    res.render('account/producer')
})


//test data to show users
Router.get('/test', async (req, res) => {
    await connect();
    usersSchema.find({}, { "_id": 0, "username": 1 }, (err, data) => {
        console.log(data)
        res.send(data)
    })
    // await dis();
})

// provider
Router.get('/provider', (req, res) => {
    res.render('account/provider')
})

//error custom
Router.get("*", (req, res) => {
    res.render('error')
})

module.exports = Router;
