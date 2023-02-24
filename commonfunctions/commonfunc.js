// connection string
const { connect } = require('../config/connect')
require('dotenv').config()
// jwt
const jwt = require('jsonwebtoken')
const moment = require('moment');
// nodemailer
const htmlcontent = require('../config/connection_config').htmlcontent

// mail service
const Nodemailer = require('nodemailer') // mailOptions
// news fetch
const fetch = require('node-fetch') // for fetch api

// models
const userSchema = require('../models/userschema')
const providerSchema = require('../models/providerschema')
const producerSchema = require('../models/producerschema')

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

// send signup email for provider
function sendSignupEmail1(email) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Thanks For Registering',
    text: 'Thanks For Registering',
    html:
      `
        <a href="https://onlyvaccine.onrender.com/account/provider/verify/` +
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

// send signup email for provider
function sendSignupEmail2(email) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Thanks For Registering',
    text: 'Thanks For Registering',
    html:
      `
        <a href="https://onlyvaccine.onrender.com/account/producer/verify/` +
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

// send signup email for user
function sendSignupEmail(email) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Thanks For Registering',
    text: 'Thanks For Registering',
    html:
      `
        <a href="https://onlyvaccine.onrender.com/account/user/verify/` +
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
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: 'OTP',
    html: `
      <img style="width:80%;height:80%" src="https://apimeme.com/meme?meme=Patrick-Bateman&top=`+ username + `&bottom=Your%20OTP%20is%20` + otp + `">
      <br>
      <h2>`+
      username + `</h2> <p>My Brother in Christ</p> 
      <p>Your Otp is <h1>` + otp + `<h1></p>`
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

// provider reset
function provider_reset(email, username, otp) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: 'OTP',
    html: `
      <img style="width:80%;height:80%" src="https://apimeme.com/meme?meme=Patrick-Bateman&top=`+ username + `&bottom=Your%20OTP%20is%20` + otp + `">
      <br>
      <h2>`+
      username + `</h2> <p>My Brother in Christ</p> 
      <p>Your Otp is <h1>` + otp + `<h1></p>`
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

// producer_reset
function producer_reset(email, username, otp) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: 'OTP',
    html: `
      <img style="width:80%;height:80%" src="https://apimeme.com/meme?meme=Patrick-Bateman&top=`+ username + `&bottom=Your%20OTP%20is%20` + otp + `">
      <br>
      <h2>`+
      username + `</h2> <p>My Brother in Christ</p> 
      <p>Your Otp is <h1>` + otp + `<h1></p>`
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
  var mailOptions = {
    from: process.env.EMAIL,
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

// book appo mail
// mail service for subscription
function user_bookappo(email, username, result) {

  console.log(result)
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Appointment Booked',
    text: 'Your Appointment was booked',
    html: `
    Dear `+ username + `, <br>
  
    Your appointment on `+ result.details.date + " & " + moment(result.details.time).format('hh:mm A') + ` At ` + result.address + `is Booked Successfully Our team is looking forward to seeing you soon! <br>
  
    As always, we want to give you the best quality of care. If you have any questions or you\'d like to talk to us about your upcoming services, feel free to reach out anytime. We\'ll get back to you as soon as possible. <br>
  
    Please let us know if there\'s anything else we can do for you. <br>
  
    Warm regards, <br>
    Location : https://www.google.com/maps/place/`+ result.details.position[0] + `%20` + result.details.position[1] + ``
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
  const type = req.cookies.type
  // console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (type == "User") {
          if (err) return res.json({ msg: err.message })
          req.user = result
          console.log(req.user + ' auth')
          next()
        } else {
          return res.redirect('/account')
        }
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



// get live data on refresh and cookie saved in cookie for each sesion
async function livedata(req, res, next) {
  await connect()
  // add user to req
  req.user = await userSchema.findOne({ email: req.user.email })
  // console.log(req.user.email);
  // console.log("req user");
  if (req.user == null) {
    res.clearCookie('jwt')
    res.redirect('/account/user')
  } else {
    next()
  }
}

async function pauth(req, res, next) {
  const cookie = req.cookies.jwt
  const type = req.cookies.type
  console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (type == "Provider") {
          if (err) return res.json({ msg: err.message })
          req.user = result
          console.log(req.user + ' auth')
          next()
        }
        else {
          return res.redirect('/account')
        }
      }
    )
  } else {
    return res.redirect('/account/provider')
  }
}

// get live data on refresh and cookie saved in cookie for each sesion
async function livepdata(req, res, next) {
  await connect()
  // add user to req
  req.user = await providerSchema.findOne({ email: req.user.email })
  // console.log(req.user.email);
  // console.log("req user");
  if (req.user == null) {
    res.clearCookie('jwt')
    res.redirect('/account/provider')
  } else {
    next()
  }
}

async function pauth(req, res, next) {
  const cookie = req.cookies.jwt
  const type = req.cookies.type
  console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (type == "Provider") {
          if (err) return res.json({ msg: err.message })
          req.user = result
          console.log(req.user + ' auth')
          next()
        }
        else {
          return res.redirect('/account')
        }
      }
    )
  } else {
    return res.redirect('/account/provider')
  }
}

// get live data on refresh and cookie saved in cookie for each sesion
async function livepdata(req, res, next) {
  await connect()
  // add user to req
  req.user = await providerSchema.findOne({ email: req.user.email })
  // console.log(req.user.email);
  // console.log("req user");
  if (req.user == null) {
    res.clearCookie('jwt')
    res.redirect('/account/provider')
  } else {
    next()
  }
}
async function proauth(req, res, next) {
  const cookie = req.cookies.jwt
  const type = req.cookies.type
  console.log(cookie)
  if (cookie != undefined) {
    jwt.verify(
      cookie,
      require('../config/connection_config').jwt_token,
      (err, result) => {
        if (type == "Producer") {
          if (err) return res.json({ msg: err.message })
          req.user = result
          console.log(req.user + ' auth')
          next()
        }
        else {
          return res.redirect('/account')
        }
      }
    )
  } else {
    return res.redirect('/account/provider')
  }
}

// get live data on refresh and cookie saved in cookie for each sesion
async function liveprodata(req, res, next) {
  await connect()
  // add user to req
  req.user = await producerSchema.findOne({ email: req.user.email })
  // console.log(req.user.email);
  // console.log("req user");
  if (req.user == null) {
    res.clearCookie('jwt')
    res.redirect('/account/producer')
  } else {
    next()
  }
}

// send signup email for user
function sendrecept(email, result, data) {
  console.log(data)
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Order Confirmed',
    text: 'Thanks For Ordering',
    html: `  
  Hello User,<br>

  We\'re happy to let you know that we\'ve received your order. <br>

  Once your package ships, it will be updated in the Orders Section. <br> 
  
  <li>Quantiy x `+ result.stock + `</li>
  <li>Vaccine Code (CPT) `+ result.vaccinecode + `</li>
  <li>Delivery Address `+ result.details.ngoaddress + `</li>

  <br>
  If you have any questions, contact us here or call us on `+ data.detail.phone + ` We are here to help! <br>

  Returns: If you would like to return your product(s), please see us at our location <cite>`+ data.detail.address + `</cite> or contact us. <br>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = {
  sendmail,
  covid,
  session,
  generateOTP,
  sendnews,
  sendedunews,
  sendSignupEmail,
  sendSignupEmail1,
  sendSignupEmail2,
  jwt,
  bcrypt,
  auth,
  isauthvalid,
  livedata,
  pauth,
  livepdata,
  proauth,
  liveprodata,
  user_reset,
  provider_reset,
  producer_reset,
  user_bookappo,
  sendrecept
}

