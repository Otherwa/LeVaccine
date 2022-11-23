// connection string
const { connect } = require('../config/connect')
require('dotenv').config()
// jwt
const jwt = require('jsonwebtoken')

// nodemailer
const htmlcontent = require('../config/connection_config').htmlcontent
const htmlcontent1 = require('../config/connection_config').htmlcontent1

// mail service
const Nodemailer = require('nodemailer') // mailOptions
// news fetch
const fetch = require('node-fetch') // for fetch api

// models
const userSchema = require('../models/userschema')

// passport authentication for username and password by passport

const session = require('express-session')
const bcrypt = require('bcrypt')

// email config
const transporter = Nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

// send signup email
function sendSignupEmail(email) {
  const mailOptions = {
    from: 'levaccine69@gmail.com',
    to: email,
    subject: 'Thanks For Registering',
    text: 'Thanks For Registering',
    html:
      `
        <a href="https://drug-lord.onrender.com/account/user/verify/` +
      email +
      '">' +
      `Verify</a>
        <br>
        <p>Please Continue to Verify Your Account</p>
        `
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  return OTP
}

// user reset password
// send signup email
function user_reset(email, username, otp) {
  const mailOptions = {
    from: 'levaccine69@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: 'OTP',
    html:
      `
        <p>` +
      username +
      `</p>
        <br>
        <p>Your OTP is:</p>
        <h1>` +
      otp +
      `</h1>
        `
  }
  transporter.sendMail(mailOptions, function (error, info) {
    console.log('sending.......')
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
// mail service for subscription
function sendmail(email) {
  const mailOptions = {
    from: 'levaccine69@gmail.com',
    to: email,
    subject: 'Thanks For Subscribing to us',
    text: 'Thanks For Subscribing to us',
    html: htmlcontent
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

// home page
async function sendnews() {
  const data = fetch(
    'https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=550660667a8646b08d2de09b578f1aa6'
  )
    .then((response) => response.json())
    .then((data) => {
      // do some stuff
      return data
    })
    .catch((error) => {
      return error
    })

  return data
}

// covid counter
// home page
async function covid() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
      'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
  }

  const data = fetch(
    'https://covid-193.p.rapidapi.com/statistics?country=india',
    options
  )
    .then((response) => response.json())
    .then((data) => {
      // do some stuff
      return data
    })
    .catch((error) => {
      return error
    })

  return data
}

// news education
function sendedunews() {
  const data = fetch(
    'https://newsapi.org/v2/everything?q=medical&pageSize=3&sortBy=publishedAt&language=en&apiKey=550660667a8646b08d2de09b578f1aa6'
  )
    .then((response) => response.json())
    .then((data) => {
      // do some stuff
      return data
    })
    .catch((error) => {
      return error
    })

  return data
}

// midleware functions
// middleware auth function verify and set a web token
async function auth(req, res, next) {
  const cookie = req.cookies.jwt
  console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (err) return res.json({ msg: err.message })
        req.user = result
        console.log(req.user + ' auth')
        next()
      }
    )
  } else {
    return res.redirect('/account/user')
  }
}

function isauthvalid(req, res, next) {
  const cookie = req.cookies.jwt
  console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (err) return res.json({ msg: err.message })
        req.user = result
        console.log(req.user + ' auth')
        next()
      }
    )
  } else {
    req.flash('message', 'Login to get api key')
    return res.redirect('/account/user')
  }
}

function isauth(req, res, next) {
  const cookie = req.cookies.jwt
  // console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (err) return res.json({ msg: err.message })
        req.user = result
        console.log(req.user + 'is authentication')
        return res.redirect('/account/user/dash')
      }
    )
  } else {
    next()
  }
}

// get live data on refresh and cookie saved in cookie for each sesion
async function livedata(req, res, next) {
  await connect()
  // add user to req
  req.user = await userSchema.findOne({ email: req.user.email })
  // console.log(req.user.email);
  // console.log("req user");
  if (req.user == null) {
    res.clearCookie('jwt')
    res.redirect('/account/user/')
  } else {
    next()
  }
}

module.exports = {
  sendmail,
  covid,
  session,
  generateOTP,
  sendnews,
  sendedunews,
  sendSignupEmail,
  jwt,
  bcrypt,
  auth,
  isauth,
  isauthvalid,
  livedata,
  user_reset
}
