const express = require('express')
const Router = express.Router()
const { connect } = require('../config/connect')
const { producerSchema } = require('../models/methods/producer_meth')
// const stonks = require('../models/stonks')
const { proauth, bcrypt } = require('../commonfunctions/commonfunc')

require('dotenv').config()
// confidental password
// for password reset for each ip

// for other collections
const reset_otp = require('../models/reset_pass')

const producer = new producerSchema()

// if creation successfull
Router.post('/signup', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const key = req.body.key
    console.log(key)
    await producer.signup(req, res, username, email, password, key)
})

// if login is successful
Router.post('/login', async (req, res) => {
    // user login
    const username = req.body.username
    const password = req.body.password
    // to check if login exisit
    producer.login(req, res, username, password)
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
        producerSchema.findOne({ email: { $eq: email } }, { username: 1 }, (err, data) => {
            if (err) res.json(err)

            if (data != null) {
                let username = data.username
                producer.reset_otp(req, res, email, username)
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
                producerSchema.findOneAndUpdate(filter, update, async (err, data) => {
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
    producer.reset_otp(req, res, email)
    res.send(200)
})

// profile
Router.post('/dash/profile', proauth, async (req, res) => {
    console.log(req.body)
    producer.profile(req, res, req.body.lat, req.body.lon, req.user.email, req.body.fname, req.body.lname, req.body.adhar, req.body.age, req.body.address, req.body.gender, req.body.phone, req.body.city, req.body.region, req.body.postcode)

})

// authorize
Router.put('/dash/authorize/authprovider', proauth, async (req, res) => {
    console.log(req.body)
    producer.authorize(req, res, req.body.user)
})


// unauthorize
Router.put('/dash/authorize/unauthprovider', proauth, async (req, res) => {
    console.log(req.body)
    producer.unauthorize(req, res, req.body.user)
})

// stonks set
Router.post('/dash/setstonks/set', proauth, async (req, res) => {
    console.log(req.body)
    producer.setstonk(req, res, req.user._id, req.body.vacname, req.body.vaccode, req.body.des, req.body.effec, req.body.stonk, req.body.agai)
})

// stonks set
Router.put('/dash/setstonks/delete', proauth, async (req, res) => {
    console.log(req.body)
    producer.deletestonk(req, res, req.body._id)
})

// stonks set
Router.put('/dash/setstonks/update', proauth, async (req, res) => {
    console.log(req.body)
    producer.updatestonk(req, res, req.body._id, req.body.vaccine, req.body.vaccinecode, req.body.description, req.body.effectiveness, req.body.stocks, req.body.against)
})

// stonks set
Router.put('/dash/orders/update', proauth, async (req, res) => {
    console.log(req.body)
    producer.updateorder(req, res, req.body.id, req.body.status)
})

// stonks set
Router.put('/dash/orders/delete', proauth, async (req, res) => {
    console.log(req.body)
    producer.deleteorder(req, res, req.body.id)
})

module.exports = { Router }