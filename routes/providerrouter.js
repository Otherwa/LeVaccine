const express = require('express')
const Router = express.Router()
const { connect } = require('../config/connect')
const { providerSchema } = require('../models/methods/provider_meth')
const { pauth, livepdata, bcrypt } = require('../commonfunctions/commonfunc')
const moment = require('moment');

require('dotenv').config()
// confidental password
// for password reset for each ip

// for other collections
const reset_otp = require('../models/reset_pass')

const provider = new providerSchema()

// if creation successfull
Router.post('/signup', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    await provider.signup(req, res, username, email, password)
})

// if login is successful
Router.post('/login', async (req, res) => {
    // user login
    const username = req.body.username
    const password = req.body.password
    // to check if login exisit
    provider.login(req, res, username, password)
})

Router.post('/reset', async (req, res) => {
    // user reset
    const key = req.cookies.Status
    console.log(key)
    if (key === 'Reset') {
        const email = req.body.email
        console.log(email)
        await connect()
        // checks if account exisits or not
        providerSchema.findOne({ email: { $eq: email } }, { username: 1 }, (err, data) => {
            if (err) res.json(err)

            if (data != null) {
                let username = data.username
                provider.reset_otp(req, res, email, username)
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
                providerSchema.findOneAndUpdate(filter, update, async (err, data) => {
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
    provider.reset_otp(req, res, email)
    res.send(200)
})


Router.post('/dash/setappo', pauth, livepdata, async (req, res) => {
    // token set or
    console.log(req.body.authentication)
    const check = req.user.auth
    const byid = req.user._id
    const addr = req.body.address
    const city = req.body.city
    const state = req.body.state
    const postcode = req.body.postcode
    const vaccine = req.body.forvaccine
    const time = req.body.time
    const date = req.body.date

    provider.setappo(req, res, req.body.lat, req.body.lon, check, byid, addr, city, state, postcode, vaccine, req.body.slots, moment(time, 'hh:mm').format(), date)
})

Router.post('/dash/profile', pauth, livepdata, async (req, res) => {
    console.log(req.body)
    provider.profile(req, res, req.body.lat, req.body.lon, req.user.email, req.body.fname, req.body.lname, req.body.adhar, req.body.age, req.body.address, req.body.gender, req.body.phone, req.body.city, req.body.region, req.body.postcode, req.body.ngo, req.body.ngoaddress)

})

// stop appointments
Router.post('/dash/appos/:id', pauth, livepdata, async (req, res) => {
    console.log(req.body)
    let appointmet_id = req.params.id

    //stop appointemts
    provider.stopappo(req, res, appointmet_id)

})

// check patients
Router.put('/dash/appos/check', async (req, res) => {
    provider.check(req, res, req.body.appoid, req.body.userid)
})

// stop appointments
Router.put('/dash/appos/:id', pauth, livepdata, async (req, res) => {
    console.log(req.body)
    let appointmet_id = req.params.id

    //stop appointemts
    provider.startappo(req, res, appointmet_id)

})

module.exports = { Router }