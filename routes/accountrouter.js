const express = require('express')
const Router = express.Router()
const userRouter = require('./userrouter').Router
const providerRouter = require('./providerrouter').Router
const { connect } = require('../config/connect')
const { userSchema } = require('../models/methods/user_meth')
const { providerSchema } = require('../models/methods/provider_meth')
const { pauth, livepdata, auth, livedata, bcrypt } = require('../commonfunctions/commonfunc')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50
});
// implemented usermodel added methods in prototype and create a instanceof user
require('dotenv').config()
// confidental password
// for password reset for each ip
Router.use(limiter)
// user Router

// routes
Router.use('/user', userRouter)
Router.use('/provider', providerRouter)


const appolist = require('../models/apposchema')

const user = new userSchema()
const provider = new providerSchema()

// index
Router.get('/', (req, res) => {
  res.status(200).render('account/whichlogin')
})

// user
Router.get('/user', (req, res) => {
  res.status(200).render('account/user', {
    err: req.flash('message'),
    err1: req.flash('message1')
  })
})

// account creation
Router.get('/user/signup', (req, res) => {
  res.status(200).render('account/user/signup', { msg: req.flash('message1') })
})


// reset password
Router.get('/user/reset', (req, res) => {
  // user reset
  res.render('account/user/user-reset')
})

// all middleware functions in common
Router.get('/user/dash', auth, livedata, async (req, res) => {
  // token set or

  await connect()
  const count = await userSchema.count()
  const cookie = req.cookies.jwt
  // get req user
  console.log(req.user)
  res.render('account/user/dashboard', {
    data: req.user,
    token: cookie,
    count
  })
})

// all users actions preformable

// book appointmets
Router.get('/user/dash/bookappo', auth, livedata, async (req, res) => {

  await connect()
  const count = await userSchema.count()
  const cookie = req.cookies.jwt

  res.render('account/user/bookappo', {
    data: req.user,
    token: cookie,
    count
  });
})

// update profile
Router.get('/user/dash/profile', auth, livedata, async (req, res) => {
  await connect()
  const count = await userSchema.count()
  const cookie = req.cookies.jwt
  // console.log(req.user)
  res.render('account/user/profile', {
    data: req.user,
    token: cookie,
    msg: req.flash('success')
  });
})

// user logout
Router.get('/user/logout', async (req, res) => {
  user.logout(req, res)
})

// reset otp user
Router.get('/user/verify/:email', async (req, res) => {
  const email = req.params.email
  await connect()
  console.log(email)

  const exsist = await userSchema.findOne({ email })

  if (exsist === null) {
    res.redirect('/')
  } else {
    if (exsist.verified === false) {
      const filter = { email }
      const update = { $set: { verified: true } }

      userSchema.findOneAndUpdate(filter, update, (err, result) => {
        if (err) {
          res.json(err)
        } else {
          res.render('account/verify')
        }
      })
    } else {
      res.redirect('/')
    }
  }
})

// ------------------------------------------------------------------



// provider
Router.get('/provider', (req, res) => {
  res.render('account/provider', {
    err: req.flash('message'),
    err1: req.flash('message1')
  })
})

// provider sign up
// account creation
Router.get('/provider/signup', (req, res) => {
  res.status(200).render('account/provider/signup',
    {
      msg: req.flash('message1')
    }
  )
})


// reset password
Router.get('/provider/reset', (req, res) => {
  // user reset
  res.render('account/provider/provider-reset')
})

// reset password otp sent


// all middleware functions in common
Router.get('/provider/dash', pauth, livepdata, async (req, res) => {
  // token set or

  await connect()
  const count = await providerSchema.count()
  const cookie = req.cookies.jwt
  // get req user
  console.log(req.user)
  res.render('account/provider/dashboard', {
    data: req.user,
    token: cookie,
    count
  })
})

Router.get('/provider/dash/profile', pauth, livepdata, async (req, res) => {
  // token set or

  await connect()
  const count = await providerSchema.count()
  const cookie = req.cookies.jwt
  // get req user
  console.log(req.user)
  res.render('account/provider/profile', {
    data: req.user,
    token: cookie,
    msg: req.flash('success')
  })
})

Router.get('/provider/dash/setappo', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()
  const count = await providerSchema.count()
  const cookie = req.cookies.jwt
  console.log(req.user._id)
  var id = req.user._id
  id = id.toString()
  console.log(id)
  appolist.find({ byappo: id }, function (err, result) {
    if (err) {
      console.error(err)
    } else {
      console.log(req.user)
      res.render('account/provider/setappo', {
        data: req.user,
        token: cookie,
        appos: result,
        msg: req.flash('messagesetappo')
      })
    }
  })
})


Router.get('/provider/logout', async (req, res) => {
  provider.logout(req, res)
})

// reset otp user
Router.get('/provider/verify/:email', async (req, res) => {
  const email = req.params.email
  await connect()
  console.log(email)

  const exsist = await providerSchema.findOne({ email })

  if (exsist === null) {
    res.json({ msg: 'no user' })
  } else {
    if (exsist.verified === false) {
      const filter = { email }
      const update = { $set: { verified: true } }

      providerSchema.findOneAndUpdate(filter, update, (err, result) => {
        if (err) {
          res.json(err)
        } else {
          res.json({ msg: 'verifed redirecting any minute', res: result })
        }
      })
    } else {
      res.json({ msg: 'Already Verified' })
    }
  }
})



// producer
Router.get('/producer', (req, res) => {
  res.render('account/producer')
})


// error custom
Router.get('*', (req, res) => {
  res.render('error')
})

module.exports = { Router }
