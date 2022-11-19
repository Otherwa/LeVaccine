const express = require('express');
const Router = express.Router();
const { connect } = require('../config/connect');
const { userSchema } = require('../models/methods/user_meth');
const { auth, livedata, bcrypt } = require('../commonfunctions/commonfunc');
// implemented usermodel added methods in prototype and create a instanceof user

const reset_otp = require('../models/reset_pass');

var user = new userSchema();

// index
Router.get('/', (req, res) => {
    res.status(200).render('account/whichlogin')
})

// user
Router.get('/user', (req, res) => {
    res.status(200).render('account/user', { err: req.flash('message'), err1: req.flash('message1') })
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


// if login is successful
Router.post('/user/login', async (req, res) => {
    // user login
    const username = req.body.username;
    const password = req.body.password;
    // to check if login exisit
    user.login(req, res, username, password);
})

// reset password
Router.get('/user/reset', async (req, res) => {
    // user reset
    res.render('account/user/user-reset');
})

// reset password otp sent
Router.post('/user/reset', async (req, res) => {
    // user reset
    var email = req.body.email;
    console.log(email);
    user.reset_otp(req, res, email);
})

Router.post('/user/reset-password', async (req, res) => {
    // user reset
    await connect();
    var email = req.body.email;
    var otp = req.body.otp;
    // console.log(otp);
    // console.log(email);
    var exsist = await reset_otp.exists({ email: email, otp: otp });
    console.log(exsist);
    if (exsist) {
        res.send("200");
    } else {
        res.send("404");
    }
})

Router.post('/user/reset-password-ok', async (req, res) => {
    // user reset
    await connect();
    var email = req.body.email;
    var password = req.body.password;
    var otp = req.body.otp;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err);

            const filter = { email: email };
            const update = { $set: { password: hash } };
            userSchema.findOneAndUpdate(filter, update, async (err, result) => {
                if (err) {
                    res.json("404")
                }
                else {
                    var exsist = await reset_otp.deleteOne({ email: email, otp: otp });
                    console.log(exsist);
                    if (exsist) {
                        res.send("200");
                    } else {
                        res.send("404");
                    }
                }
            });
        });
    })
})

Router.post('/user/reset', async (req, res) => {
    // user reset
    var email = req.body.email;
    console.log(email);
    user.reset_otp(req, res, email);
    res.send(200);
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

// reset otp user
Router.get('/user/reset/:email&key', async (req, res) => {
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
            res.json({ msg: "Already Verified" })
        }
    }
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
            res.json({ msg: "Already Verified" })
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
