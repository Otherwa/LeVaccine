const express = require('express')
const Router = express.Router()
const { connect } = require('../config/connect')
const { userSchema } = require('../models/methods/user_meth')
const { providerSchema } = require('../models/methods/provider_meth')
const { pauth, livepdata, auth, livedata, bcrypt } = require('../commonfunctions/commonfunc')
// implemented usermodel added methods in prototype and create a instanceof user
require('dotenv').config()
// confidental password
// for password reset for each ip

// for other collections
const reset_otp = require('../models/reset_pass')
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
  res.status(200).render('account/user/signup')
})

// if creation successfull
Router.post('/user/signup', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  await user.signup(req, res, username, email, password)
})

// if login is successful
Router.post('/user/login', async (req, res) => {
  // user login
  const username = req.body.username
  const password = req.body.password
  // to check if login exisit
  user.login(req, res, username, password)
})

// reset password
Router.get('/user/reset', (req, res) => {
  // user reset
  res.render('account/user/user-reset')
})

// reset password otp sent
Router.post('/user/reset', async (req, res) => {
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
Router.post('/user/reset-password', async (req, res) => {
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
Router.post('/user/reset-password-ok', async (req, res) => {
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

Router.post('/user/reset', async (req, res) => {
  // user reset
  const email = req.body.email
  console.log(email)
  user.reset_otp(req, res, email)
  res.send(200)
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
    res.json({ msg: 'no user' })
  } else {
    if (exsist.verified === false) {
      const filter = { email }
      const update = { $set: { verified: true } }

      userSchema.findOneAndUpdate(filter, update, (err, result) => {
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
  res.status(200).render('account/provider/signup')
})


// if creation successfull
Router.post('/provider/signup', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  await provider.signup(req, res, username, email, password)
})

// if login is successful
Router.post('/provider/login', async (req, res) => {
  // user login
  const username = req.body.username
  const password = req.body.password
  // to check if login exisit
  provider.login(req, res, username, password)
})

// reset password
Router.get('/provider/reset', (req, res) => {
  // user reset
  res.render('account/provider/provider-reset')
})

// reset password otp sent
Router.post('/provider/reset', async (req, res) => {
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
Router.post('/provider/reset-password', async (req, res) => {
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
Router.post('/provider/reset-password-ok', async (req, res) => {
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

Router.post('/provider/reset', async (req, res) => {
  // user reset
  const email = req.body.email
  console.log(email)
  provider.reset_otp(req, res, email)
  res.send(200)
})

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
        count,
        appos: result,
        msg: req.flash('messagesetappo')
      })
    }
  })
})

Router.post('/provider/dash/setappo', pauth, livepdata, async (req, res) => {
  // token set or
  // console.log(req.body)
  const check = req.body.authentication
  const byid = req.user._id
  const addr = req.body.address
  const city = req.body.city
  const state = req.body.state
  const postcode = req.body.postcode
  const vaccine = req.body.forvaccine
  const time = req.body.time
  const date = req.body.date

  provider.setappo(req, res, check, byid, addr, city, state, postcode, vaccine, time, date)
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
