const express = require('express');
const Router = express.Router();
const usersSchema = require('../models/userschema');
const { connect, dis } = require('../config/connect');

//account


// index
Router.get('/', (err, res) => {
    res.status(200).render('account/whichlogin')
})

// user
Router.get('/login', (req, res) => {
    res.status(200).render('account/login')
})

// account creation
Router.get('/user/createaccount', (req, res) => {
    res.status(200).render('account/user/usercreateaccount', { title: "Create Account", status: "Login", msg: " " })
})

// if creation successfull
Router.post('/user/createaccount', (req, res) => {
    try {
        // set date
        const date = new Date()
        console.log(date)
        const { username, password, cpassword, name, age, gender, address, mail, phone, city, region, pincode, state, country } = req.body
        if (password === cpassword) {
            const userData = new usersSchema({
                username,
                password,
                name,
                age,
                gender,
                address,
                mail,
                phone,
                city,
                region,
                pincode,
                state,
                country,
                date
            })
            var user_check = usersSchema.findOne({ username: username, mail: mail })
            if (username === user_check.username) {
                console.log("error")
            } else {
                userData.save(err => {
                    if (err) {
                        console.error(err);
                        res.status(400).render('account/user/usercreateaccount', { title: "Create Account", status: "Login", msg: "Account Already exisits" })
                    } else {
                        res.status(200).render('account/user/usercreateaccount', { title: "Create Account", status: "Login", msg: "Your Account was successfully created" })
                    }
                })
            }
        } else {
            res.status(200).render('account/user/usercreateaccount', { title: "Create Account", status: "Login", msg: "Passwords Do not match" })
        }
    }
    catch (err) {
        console.log(err)
    }
})

// account login
Router.get('/user/login', (req, res) => {
    res.status(200).render('account/user/userlogin', { title: "Login" })
})

// if login is successful
Router.post('/user/login', (req, res) => {
    // if successful render dashboard with userData

    res.render('account/userdash',)
})

// producer
Router.get('/producer', (req, res) => {
    res.render('account/producer', { title: "Producer" })
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
    res.render('account/provider', { title: "Provider" })
})

module.exports = Router;