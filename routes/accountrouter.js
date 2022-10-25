const express = require('express');
const Router = express.Router();
const usersSchema = require('../models/userschema');
const { connect } = require('../config/connect');


const { sendSignupEmail, bcrypt, jwt, auth, isauth } = require('../commonfunctions/commonfunc');


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
        res.redirect('/account/user/signup');
        return;
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return next(err);

                const user = new usersSchema({
                    username: username,
                    email: email,
                    password: hash
                });

                user.save();
                sendSignupEmail(email);
                res.redirect('/account/user/login');
            });
        });
    }
})

//auth in common functions
// account login
Router.get('/user/login', isauth, (req, res) => {
    res.render('account/user/login', { err: req.flash('message') });
})


// if login is successful
Router.post('/user/login', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    await connect();

    const user = await usersSchema.findOne({ username: username }).lean()
    console.log(user);
    if (user != null) {
        bcrypt.compare(password, user.password, function (err, data) {
            if (err) res.send({ msg: 'no user' })
            //if both match than you can do anything
            if (data) {
                // return res.status(200).json({ msg: "Login success" })
                const token = jwt.sign(user, require('../config/connection_config').jwt_token)
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), //2 hrs login
                    httpOnly: true
                });
                console.log(res.cookie);
                res.redirect('/account/user/dash')
            } else {
                return res.status(401).json({ msg: "Invalid credencial" })
            }
        });
    } else {
        req.flash('message', 'No user exsist')
        res.redirect('/account/user/login');
        return;
    }
})



// get live data on refresh and cookie saved in cookie for each sesion
async function livedata(req, res, next) {
    req.user = await usersSchema.findOne({ email: req.user.email });
    // console.log(req.user);
    next();
}

Router.get('/user/dash', auth, livedata, async (req, res) => {
    // token set or 
    const cookie = req.cookies.jwt;
    console.log(req.user);
    res.render('account/user/dashboard', { data: req.user, token: cookie });
});


Router.get('/user/logout', function (req, res) {
    res.clearCookie('jwt'); //clear cookie
    res.redirect('/account/user/login')
});

// email verification
Router.get('/user/verify/:email', async (req, res) => {
    var email = req.params.email;
    await connect();
    console.log(email)
    var exsist = await usersSchema.findOne({ email: email });

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

module.exports = { Router, auth };
