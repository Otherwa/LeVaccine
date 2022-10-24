const express = require('express');
const Router = express.Router();
const usersSchema = require('../models/userschema');
const { connect } = require('../config/connect');

const { passport, session, authenticationmiddleware, sendSignupEmail, isLoggedOut, bcrypt, sendmail } = require('../commonfunctions/commonfunc');



// for session management of user passport module
// passport start
Router.use(session({
    secret: require('../config/connection_config').pass,
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
    var email = req.body.email;
    var password = req.body.password;
    const exists = await usersSchema.exists({ email: email });
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
                email: email,
                password: hash
            });

            newAdmin.save();
            sendSignupEmail(email);
            res.redirect('/account/user/login');
        });
    });
})

// account login
Router.get('/user/login', isLoggedOut, (req, res) => {
    res.status(200).render('account/user/login')
})

//passing data from login to dash board via redirect
const data = []
// if login is successful
Router.post('/user/login', passport.authenticate('local', {
    // if not valid send to error via module in common fucntions
    successRedirect: '/account/user/dash',
    failureRedirect: '/account/user/login'
})
)


Router.get('/user/dash', authenticationmiddleware, (req, res) => {
    res.render('account/user/dashboard', { data: req.user })
});

Router.get('/user/logout', function (req, res) {
    req.logout(function (err) {
        if (!err) {
            res.redirect('/account/user/login');
        }
    });
});

Router.get('/user/verify/:email', async (req, res) => {
    var email = req.params.email;
    await connect();
    console.log(email)

    var exsist = await usersSchema.findOne({ email: email });
    // console.log(exsist)
    // if exis
    if (exsist === null) {
        res.json({ msg: "no user" })
    }
    else {
        if (exsist.verified === false) {
            const filter = { email: email };
            const update = { $set: { verified: true } };

            usersSchema.findOneAndUpdate(filter, update, (err, result) => {
                if (err) {
                    res.json(err)
                }
                else {
                    res.json({ msg: "verifed", res: result })
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
