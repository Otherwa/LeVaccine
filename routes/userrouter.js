const express = require('express')
const Router = express.Router()
const { connect } = require('../config/connect')
const { userSchema } = require('../models/methods/user_meth')
const { uploadu, auth, livedata, bcrypt } = require('../commonfunctions/commonfunc')
const fs = require('fs')
// implemented usermodel added methods in prototype and create a instanceof user
require('dotenv').config()
// confidental password
// for password reset for each ip

// for other collections
const reset_otp = require('../models/reset_pass')

const user = new userSchema()

// if creation successfull
Router.post('/signup', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    await user.signup(req, res, username, email, password)
})

// if login is successful
Router.post('/login', async (req, res) => {
    // user login
    const username = req.body.username
    const password = req.body.password
    // to check if login exisit
    user.login(req, res, username, password)
})

// reset password otp sent
Router.post('/reset', async (req, res) => {
    // user reset
    const key = req.cookies.Status
    console.log(key)
    if (key === 'Reset') {
        const email = req.body.email
        console.log(email)
        await connect()
        // checks if account exisits or not
        userSchema.findOne({ email: { $eq: email } }, { username: 1 }, (err, data) => {
            if (err) res.json(err)

            if (data != null) {
                let username = data.username
                user.reset_otp(req, res, email, username)
                res.send('200')
            } else {
                res.send('300')
            }
        })
    } else {
        res.send('400')
    }
})

// ajax
Router.post('/reset-password', async (req, res) => {
    // user reset
    const key = req.cookies.Status
    console.log(key)
    if (key === 'Reset') {
        await connect()
        const email = req.body.email
        const otp = req.body.otp
        // console.log(otp);
        // console.log(email);
        const exsist = await reset_otp.exists({ email: { $eq: email }, otp: { $eq: otp } });
        console.log(exsist)
        if (exsist) {
            res.send('200')
        } else {
            res.send('404')
        }
    } else {
        res.json({ msg: 'Somethings Wrong' })
    }
})

// ajax
Router.post('/reset-password-ok', async (req, res) => {
    // user reset
    await connect()
    const email = req.body.email
    const password = req.body.password
    const otp = req.body.otp

    const key = req.cookies.Status
    console.log(key)
    if (key === 'Reset') {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err)
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return next(err)

                const filter = { email: { $eq: email } }
                const update = { $set: { password: hash } }
                userSchema.findOneAndUpdate(filter, update, async (err, data) => {
                    if (err) {
                        res.json('404')
                    } else {

                        const exsist = await reset_otp.deleteOne({
                            email: { $eq: email },
                            otp: { $eq: otp }
                        })

                        console.log(data);
                        console.log(exsist)

                        if (exsist) {
                            res.clearCookie('Status')
                            res.send('200')
                        } else {
                            res.send('404')
                        }

                    }
                })
            })
        })
    }
})

Router.post('/reset', async (req, res) => {
    // user reset
    const email = req.body.email
    console.log(email)
    user.reset_otp(req, res, email)
    res.send(200)
})

Router.post('/dash/profile', uploadu, auth, livedata, async (req, res) => {
    await connect()
    const count = await userSchema.count()
    const cookie = req.cookies.jwt
    // console.log(req.file.filename)
    var photo;
    // check if image uploaded 1st measure
    if (req.file) {
        photo = req.file.filename
        // delte previous file working dont touch
        if (req.user.detail.photo) {
            var previous_photo = req.user.detail.photo
            console.log(previous_photo.toString())
            fs.unlink('./public/uploads/user/' + previous_photo, (err) => {
                if (err) { console.log(err) }
                else {
                    console.log("deleted");
                }
            })
        }
    } else {
        photo = req.body.profilepic
    }
    user.profile(req, res, req.user.email, photo, req.body.fname, req.body.lname, req.body.adhar, req.body.age, req.body.address, req.body.gender, req.body.phone, req.body.city, req.body.region, req.body.postcode)
})

module.exports = { Router }