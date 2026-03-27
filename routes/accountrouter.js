const express = require('express')
const Router = express.Router()
const userRouter = require('./userrouter').Router
const providerRouter = require('./providerrouter').Router
const producerRouter = require('./producerrouter').Router
const { connect } = require('../config/connect')
const { userSchema } = require('../models/methods/user_meth')
const { providerSchema } = require('../models/methods/provider_meth')
const { producerSchema } = require('../models/methods/producer_meth')
const { pauth, livepdata, proauth, liveprodata, auth, livedata, bcrypt, sendnews } = require('../commonfunctions/commonfunc')
const rateLimit = require('express-rate-limit')
const appo = require('../models/apposchema')
const stonks = require('../models/stonks')
const appolists = require('../models/appolistschema')
const orders = require('../models/orders')
const moment = require('moment');


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
Router.use('/producer', producerRouter)


const user = new userSchema()
const provider = new providerSchema()
const producer = new producerSchema()

// index
Router.get('/', (req, res) => {
  res.status(200).render('account/whichlogin')
})

// user
Router.get('/user', (req, res) => {
  res.status(200).render('account/user', {
    err: req.flash('message'),
    err1: req.flash('message1'),
    csrf_token: req.csrfToken()
  })
})

// user check
Router.post('/user/check', async (req, res) => {
  await connect()
  const username = req.body.username
  const check = await userSchema.exists({ 'username': { $eq: username } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

Router.post('/user/checkmail', async (req, res) => {
  await connect()
  const email = req.body.email
  const check = await userSchema.exists({ 'email': { $eq: email } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

// account creation
Router.get('/user/signup', (req, res) => {
  res.status(200).render('account/user/signup', { msg: req.flash('message1'), csrf_token: req.csrfToken() })
})


// reset password
Router.get('/user/reset', (req, res) => {
  // user reset
  res.render('account/user/user-reset', { csrf_token: req.csrfToken() })
})

// all middleware functions in common
Router.get('/user/dash', auth, livedata, async (req, res) => {
  // token set or

  await connect()
  const count = await userSchema.countDocuments()
  const cookie = req.cookies.jwt
  const datas = await sendnews();
  // get req user
  console.log(req.user)
  res.render('account/user/dashboard', {
    data: req.user,
    token: cookie,
    count: count,
    datas: datas.articles,
    csrf_token: req.csrfToken()
  })
})

// all users actions preformable

// book appointmets
Router.get('/user/dash/bookappo', auth, livedata, async (req, res) => {

  await connect()
  const cookie = req.cookies.jwt
  console.log(moment(new Date()).format('YYYY-MM-DD'))
  console.log(moment(new Date()).format('hh:mm A'))

  if (req.user.detail) {

    // nearby pincode match
    let pincode = Number(req.user.detail.postcode)

    // match nearby pincodes
    pins = [pincode - 2, pincode - 1, pincode, pincode + 1, pincode + 2]

    console.log(pins)
    console.log(
      moment(new Date()).format()
    )
    const result = await appo.find({ 'status': false, 'postcode': { $in: pins }, 'details.date': { $gt: moment(new Date()).format('YYYY-MM-DD'), } })
    console.log(result)

    const pos = result.map(position);

    result.map(time);

    function time(item) {
      // change 24.00 to XX.XX AM/PM moment library 
      item.details.time = moment(item.details.time).format('hh:mm A');
      item.details.date = moment(item.details.date).format("MMM Do YYYY");
      // console.log(item.details.time)
    }
    // console.log(pos)
    function position(item) {
      return (item.details.position);
    }

    res.render('account/user/bookappo', {
      data: req.user,
      token: cookie,
      appos: result,
      appos_: pos,
      csrf_token: req.csrfToken()
    });
  } else {
    req.flash('success', 'Fill All Details First')
    res.redirect('/account/user/dash/profile')
  }
})

// book a appointment
Router.get('/user/dash/bookappo/:id', auth, livedata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.params.id.toString()
  try {
    const result = await appo.findById(id)
    const results = await appolists.findOne({ 'userid': req.user._id.toString(), 'appoid': id })

    result.details.time = moment(result.details.time).format('hh:mm A')
    result.details.date = moment(result.details.date).format("MMM Do YYYY");

    console.log(results)

    res.render('account/user/appo', {
      data: req.user,
      token: cookie,
      appo: result,
      appo_pos: result.details.position,
      msg: req.flash('msg'),
      err: req.flash('err'),
      check: results,
      csrf_token: req.csrfToken()
    })
  } catch (err) {
    console.log(err)
    res.redirect('user/dash/bookappo')
  }
})

Router.get('/user/dash/appointments', auth, livedata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt

  try {
    // check if user already selected the appointment or not
    const results = await appolists.find({ 'userid': req.user._id.toString() }, { 'appoid': 1, '_id': 0 })

    console.log(results)

    const userappoints = results.map(pos);
    // console.log(pos)
    function pos(item) {
      return (item.appoid.toString());
    }

    console.log(userappoints)

    const result = await appo.find({ '_id': { $in: userappoints } })

    const pos_ = result.map(position);
    // console.log(pos)
    function position(item) {
      return (item.details.position);
    }

    // map time
    result.map(time);
    function time(item) {
      // change 24.00 to XX.XX AM/PM moment library 
      item.details.time = moment(item.details.time).format('hh:mm A');
      item.details.date = moment(item.details.date).format("MMM Do YYYY")
    }

    console.log(result)
    console.log(pos_)

    res.render('account/user/appos', {
      data: req.user,
      token: cookie,
      appos: result,
      appos_: pos_,
      msg: req.flash('msg'),
      check: results,
      csrf_token: req.csrfToken()
    })
  } catch (err) {
    console.log(err)
  }
})

// update profile
Router.get('/user/dash/profile', auth, livedata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  // console.log(req.user)
  res.render('account/user/profile', {
    data: req.user,
    token: cookie,
    msg: req.flash('success'),
    csrf_token: req.csrfToken()
  });
})

// user logout
Router.get('/user/logout', async (req, res) => {
  user.logout(req, res)
})

//  verify
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

      await userSchema.findOneAndUpdate(filter, update)
      res.render('account/verify')
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
    err1: req.flash('message1'),
    csrf_token: req.csrfToken()
  })
})

// provider sign up
// account creation
Router.get('/provider/signup', (req, res) => {
  res.status(200).render('account/provider/signup',
    {
      msg: req.flash('message1'),
      csrf_token: req.csrfToken()
    }
  )
})

// provider check
Router.post('/provider/check', async (req, res) => {
  await connect()
  const username = req.body.username
  const check = await providerSchema.exists({ 'username': { $eq: username } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

Router.post('/provider/checkmail', async (req, res) => {
  await connect()
  const email = req.body.email
  const check = await providerSchema.exists({ 'email': { $eq: email } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})


// reset password
Router.get('/provider/reset', (req, res) => {
  // user reset
  res.render('account/provider/provider-reset', { csrf_token: req.csrfToken() })
})

// reset password otp sent


// all middleware functions in common
// dashboard
Router.get('/provider/dash', pauth, livepdata, async (req, res) => {
  // token set or

  await connect()
  const count = await providerSchema.countDocuments()
  const cookie = req.cookies.jwt
  const datas = await sendnews();
  // get req user
  console.log(req.user)
  res.render('account/provider/dashboard', {
    data: req.user,
    token: cookie,
    count,
    datas: datas.articles,
    csrf_token: req.csrfToken()
  })
})


// profle set/update
Router.get('/provider/dash/profile', pauth, livepdata, async (req, res) => {
  // token set or

  await connect()
  const count = await providerSchema.countDocuments()
  const cookie = req.cookies.jwt
  // get req user
  console.log(req.user)
  res.render('account/provider/profile', {
    data: req.user,
    token: cookie,
    msg: req.flash('success'),
    csrf_token: req.csrfToken()
  })
})

// set appointment
Router.get('/provider/dash/setappo', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()
  const cookie = req.cookies.jwt
  console.log(req.user._id)
  var id = req.user._id
  id = id.toString()
  console.log(id)
  const result = await appo.find({ 'byappo': id }).limit(3).sort({ '_id': -1 })

  result.map(time);

  function time(item) {
    // change 24.00 to XX.XX AM/PM moment library 
    item.details.time = moment(item.details.time).format('hh:mm A');
    item.details.date = moment(item.details.date).format("MMM Do YYYY");
    // console.log(item.details.time)
  }

  console.log(req.user)
  res.render('account/provider/setappo', {
    data: req.user,
    token: cookie,
    appos: result,
    msg: req.flash('messagesetappo'),
    csrf_token: req.csrfToken()
  })
})

// producer check mail
Router.post('/producer/check', async (req, res) => {
  await connect()
  const username = req.body.username
  const check = await producerSchema.exists({ 'username': { $eq: username } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

Router.post('/producer/checkmail', async (req, res) => {
  await connect()
  const email = req.body.email
  const check = await producerSchema.exists({ 'email': { $eq: email } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})
// appointment list
Router.get('/provider/dash/appos', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()
  const cookie = req.cookies.jwt
  console.log(req.user._id)
  var id = req.user._id
  id = id.toString()

  const result = await appo.find({ byappo: id }).sort({ 'details.date': -1 })
  result.map(time);

  function time(item) {
    // change 24.00 to XX.XX AM/PM moment library 
    item.details.time = moment(item.details.time).format('hh:mm A');
    // console.log(item.details.time)
  }

  const pos = result.map(position);
  // console.log(pos)
  function position(item) {
    return (item.details.position);
  }

  console.log(req.user)
  res.render('account/provider/appos', {
    data: req.user,
    token: cookie,
    appos_: pos,
    appos: result,
    csrf_token: req.csrfToken()
  })
})


// each appointment in appointemnt list details
Router.get('/provider/dash/appos/:id', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()
  const id = req.params.id
  const cookie = req.cookies.jwt
  console.log(req.user._id)

  try {
    const peoples_result = await appolists.find({ 'appoid': id }, { '_id': 0 })

    const peoples = peoples_result.map(ids)

    function ids(item) {
      return (item.userid.toString());
    }

    console.log(peoples)

    const result = await appo.findById(id)
    console.log(result)

    // change 24.00 to XX.XX AM/PM moment library 
    result.details.time = moment(result.details.time).format('hh:mm A');
    // console.log(item.details.time)
    const results = await userSchema.find({ '_id': { $in: peoples } })

    console.log(results)
    console.log(peoples_result)

    res.render('account/provider/appo', {
      data: req.user,
      token: cookie,
      appo_pos: result.details.position,
      appo: result,
      peoples: results,
      csrf_token: req.csrfToken(),
      appo_id: id
    })
  } catch (err) {
    console.error(err)
  }
})

// change vaccinated or not tag
// each appointment in appointemnt list details
Router.get('/provider/dash/appos/:appoid/:userid', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()
  const id = req.params.appoid
  const uid = req.params.userid
  const cookie = req.cookies.jwt
  console.log(req.user._id)

  try {
    // get appointemnt
    const result = await appo.findById(id)
    console.log(result)
    // find from appointement list
    const peoples_result = await appolists.findOne({ 'appoid': id, 'userid': uid }, { '_id': 0 })
    console.log(peoples_result)
    // find user deatils
    const results = await userSchema.findOne({ '_id': uid })
    console.log(results)
    res.render('account/provider/appopersondetails', {
      data: req.user,
      token: cookie,
      appo: result,
      peoples: results, //user
      peoples_res: peoples_result, //appo,
      appo_id: id,
      user_id: uid,
      csrf_token: req.csrfToken()
    })
  } catch (err) {
    console.error(err)
  }
})

// buy vaccines
// profle set/update
Router.get('/provider/dash/buyvaccines', pauth, livepdata, async (req, res) => {
  // token set or

  await connect()

  const cookie = req.cookies.jwt

  if (req.user.detail) {

    let pincode = Number(req.user.detail.postcode)

    // match nearby pincodes
    pins = [pincode - 2, pincode - 1, pincode, pincode + 1, pincode + 2]
    // get req user
    const result = await producerSchema.find({ 'detail.postcode': { $in: pins } })
    // console.log(result)
    // null if 
    nearby = []

    if (result) {
      console.log(result._id)
      for (var i = 0; i < result.length; i++) {
        nearby.push(result[i]._id)
      }
    }

    const data = await stonks.find({ 'prodid': { $in: nearby } })
    console.log(req.user)
    console.log(data)
    res.render('account/provider/buyvaccines', {
      data: req.user,
      token: cookie,
      stonks: data,
      csrf_token: req.csrfToken()
    })
  } else {
    req.flash('success', 'Fill All Details First')
    res.redirect('/account/provider/dash/profile')
  }
})

Router.get('/provider/dash/buyvaccines/:id', pauth, livepdata, async (req, res) => {
  // token set or
  await connect()

  const cookie = req.cookies.jwt
  id = req.params.id
  const data = await stonks.findById(id)
  console.log(data)
  res.render('account/provider/buyvaccine', {
    data: req.user,
    token: cookie,
    stonks: data,
    csrf_token: req.csrfToken()
  })
})

// setstonks
Router.get('/provider/dash/orders', pauth, livepdata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.user._id
  const result = await orders.find({ 'proid': id }).sort({ '_id': -1 })
  res.render('account/provider/orders', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    orders: result,
    csrf_token: req.csrfToken()
  });
})

// setstonks
Router.get('/provider/dash/orders/:id', pauth, livepdata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.params.id
  const result = await orders.findById(id)
  console.log(result)
  res.render('account/provider/order', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    order: result,
    csrf_token: req.csrfToken()
  });
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

      await providerSchema.findOneAndUpdate(filter, update)
      res.json({ msg: 'verifed redirecting any minute' })
    } else {
      res.json({ msg: 'Already Verified' })
    }
  }
})

// ------------------------------------------------------------------

// producer
Router.get('/producer', (req, res) => {
  res.status(200).render('account/producer', {
    err: req.flash('message'),
    err1: req.flash('message1'),
    csrf_token: req.csrfToken()
  })
})

// account creation
Router.get('/producer/signup', (req, res) => {
  res.status(200).render('account/producer/signup', { msg: req.flash('message1'), csrf_token: req.csrfToken() })
})

// user check
Router.post('/producer/check', async (req, res) => {
  await connect()
  const username = req.body.username
  const check = await producerSchema.exists({ 'username': { $eq: username } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

Router.post('/user/checkmail', async (req, res) => {
  await connect()
  const email = req.body.email
  const check = await producerSchema.exists({ 'email': { $eq: email } })
  if (check) {
    res.send({ 'status': 'found' })
  } else {
    res.send({ 'status': 'gg' })
  }
})

// reset password
Router.get('/producer/reset', (req, res) => {
  // user reset
  res.render('account/producer/producer-reset', { csrf_token: req.csrfToken() })
})

// all middleware functions in common
Router.get('/producer/dash', proauth, liveprodata, async (req, res) => {
  // token set or

  await connect()
  const count = await providerSchema.countDocuments()
  const cookie = req.cookies.jwt
  const datas = await sendnews();
  // get req user
  console.log(req.user)
  res.render('account/producer/dashboard', {
    data: req.user,
    token: cookie,
    csrf_token: req.csrfToken(),
    datas: datas.articles
  })
})



//  verify
Router.get('/producer/verify/:email', async (req, res) => {
  const email = req.params.email
  await connect()
  console.log(email)

  const exsist = await producerSchema.findOne({ email })

  if (exsist === null) {
    res.redirect('/')
  } else {
    if (exsist.verified === false) {
      const filter = { email }
      const update = { $set: { verified: true } }

      await producerSchema.findOneAndUpdate(filter, update)
      res.render('account/verify', { csrf_token: req.csrfToken() })
    } else {
      res.redirect('/')
    }
  }
})

// get profile

// update profile
Router.get('/producer/dash/profile', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  // console.log(req.user)
  res.render('account/producer/profile', {
    data: req.user,
    token: cookie,
    msg: req.flash('success'),
    csrf_token: req.csrfToken()
  });
})

//authorize providers
Router.get('/producer/dash/authorize', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  // console.log(req.user)
  // nearest or approximate provider verify
  if (req.user.detail) {
    let pincode = req.user.detail.postcode

    pins = pincode.substring(0, 2)

    const data = await providerSchema.find({ 'detail.postcode': { $regex: "^" + pins } })
    console.log(data)

    const pos = data.map(position);
    // console.log(pos)
    function position(item) {
      return (item.detail.position);
    }

    res.render('account/producer/authorize', {
      data: req.user,
      token: cookie,
      people_: data,
      people_pos: pos,
      csrf_token: req.csrfToken()
    });
  } else {
    req.flash('success', 'Fill All Details First')
    res.redirect('/account/producer/dash/profile')
  }
})


Router.get('/producer/logout', async (req, res) => {
  producer.logout(req, res)
})

// setstonks
Router.get('/producer/dash/setstonks', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.user._id
  const result = await stonks.find({ 'prodid': id }).sort({ '_id': -1 })
  res.render('account/producer/setstonks', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    stonks: result,
    csrf_token: req.csrfToken()
  });
})

// setstonks
Router.get('/producer/dash/setstonks/:id', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.params.id
  const result = await stonks.findById(id)
  res.render('account/producer/setstonksupdate', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    stock: result,
    csrf_token: req.csrfToken()
  });
})

// setstonks
Router.get('/producer/dash/orders', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.user._id
  const result = await orders.find({ 'prodid': id }).sort({ '_id': -1 })
  res.render('account/producer/orders', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    orders: result,
    csrf_token: req.csrfToken()
  });
})

// setstonks
Router.get('/producer/dash/orders/:id', proauth, liveprodata, async (req, res) => {
  await connect()
  const cookie = req.cookies.jwt
  const id = req.params.id
  const result = await orders.findById(id)
  console.log(result)
  res.render('account/producer/order', {
    data: req.user,
    token: cookie,
    msg: req.flash('msgstonks'),
    order: result,
    csrf_token: req.csrfToken()
  });
})

// error custom
Router.get('*', (req, res) => {
  res.render('error')
})

module.exports = { Router }
