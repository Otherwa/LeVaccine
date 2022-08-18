const express = require('express');
const Router = express.Router();
const usersSchema = require('../models/userschema');

//account


// index
Router.get('/', (err, res) => {
    res.status(200).render('whichlogin', { title: "Login-as" })
})

// user
Router.get('/user', (req, res) => {
    res.status(200).render('user', { title: "User" })
})

// account creation
Router.get('/user/createaccount', (req, res) => {
    res.status(200).render('usercreateaccount', { title: "Create Account", status: "Login", msg: " " })
})

// if creation successfull
Router.post('/user/createaccount', async (req, res) => {
    try {
        // set date
        const date = new Date()

        console.log(date)
        const {
            username,
            password,
            cpassword,
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
        } = req.body

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
            userData.save(err => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).render('usercreateaccount', { title: "Create Account", status: "Login", msg: "Account Created" })
                }
            })

            // await function to check if the user exsist or not via mail or username
            const user_check = await usersSchema.findOne({ $or: [{ username: username }, { mail: mail }] })
            if (mail === user_check.mail) {
                res.status(200).render('usercreateaccount', { title: "Create Account", status: "Login", msg: "A User Already Exists this email" })
            } else if (username === user_check.username) {
                res.status(200).render('usercreateaccount', { title: "Create Account", status: "Login", msg: "A User Already Exists with this username" })
            }
        } else {
            res.status(200).render('usercreateaccount', { title: "Create Account", status: "Login", msg: "Passwords Do not match" })
        }
    }
    catch (err) {
        console.msg(err)
    }
})

// account login
Router.get('/user/login', (req, res) => {
    res.render('userlogin', { title: "Create Account" })
})

Router.post('/user/login', (req, res) => {
    res.render('userlogin', { title: "Create Account" })
})
// producer
Router.get('/producer', (req, res) => {
    res.render('producer', { title: "Producer" })
})

// provider
Router.get('/provider', (req, res) => {
    res.render('provider', { title: "Provider" })
})

module.exports = Router;