const userSchema = require('../userschema')
const reset_user_pass = require('../reset_pass')
const appolist = require('../appolistschema')
const appos = require('../apposchema')
const { connect } = require('../../config/connect')
const {
  bcrypt,
  jwt,
  sendSignupEmail,
  user_reset,
  generateOTP,
  user_bookappo
} = require('../../commonfunctions/commonfunc')
// login

userSchema.prototype.login = async (req, res, username, password) => {
  await connect()

  const user = await userSchema.findOne({ username }).lean()
  // console.log(user);
  if (user != null) {
    bcrypt.compare(password, user.password, function (err, data) {
      if (err) res.send({ msg: 'somethings wrong' })
      // if both match than you can do anything
      if (data) {
        // return res.status(200).json({ msg: "Login success" })
        const token = jwt.sign(
          user,
          require('../../config/connection_config').jwt_token
        )
        res.cookie('jwt', token, {
          expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
          httpOnly: true
        })
        res.cookie('type', "User", {
          expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
          httpOnly: true
        })
        // console.log(res.cookie);
        res.redirect('/account/user/dash')
      } else {
        req.flash('message', 'Wrong Password')
        res.redirect('/account/user')
      }
    })
  } else {
    req.flash('message', 'No such user exsist')
    res.redirect('/account/user')
  }
}

// logout using cookies jwt hash protection
userSchema.prototype.logout = async (req, res) => {
  res.clearCookie('jwt') // clear cookie
  res.redirect('/account/user')
}

// sign up pass hash
userSchema.prototype.signup = async (req, res, username, email, password) => {
  if (username.length > 0 && email.length > 0 && password.length > 0) {


    await connect()
    console.log(email + 'email: ' + username)

    const exists = await userSchema.exists({ email })
    if (exists) {
      req.flash('message', 'Account Exsist')
      res.redirect('/account/user')
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) return next(err)

          const user = new userSchema({
            username,
            email,
            password: hash,
          })


          user.save((err, result) => {
            if (err) {
              console.log(err)
            } else {
              // console.log(result)
              sendSignupEmail(email)
              req.flash('message1', 'Login 🛐')
              res.redirect('/account/user')
            }
          })
        })
      })
    }
  } else {
    req.flash('message1', 'Not Valid Dude')
    res.redirect('/account/user/signup')
  }
}

userSchema.prototype.reset_otp = async (req, res, email, username) => {
  await connect()
  // console.log(email)
  const key = generateOTP()
  // reset_pass schema
  const reset_otp = new reset_user_pass({
    email,
    otp: key,
    date: new Date()
  })
  reset_otp.save()

  user_reset(email, username, key)
}


// update profile

// sign up pass hash

userSchema.prototype.profile = async (req, res, lat, lon, whichuser, fname, lname, adhar, age, addr, gender, phone, city, region, post) => {
  await connect()
  console.log(whichuser)
  console.log(post)
  var lat = parseFloat(lat)
  var lon = parseFloat(lon)
  // if adhar uploaded
  if (adhar != '' && fname != '' && lname != '' && age != '' && addr != '' && gender != '' && phone != '' && city != '' && region != '' && post != '') {
    userSchema.updateOne({ 'email': whichuser }, { $set: { 'personstatus': true } }, (err, result) => {
      if (err) { console.log(err) }
    })
  }

  // check if image uploaded or not 2 measure

  if (lat != 0 && lon != 0) {
    userSchema.findOneAndUpdate({ 'email': whichuser }, {
      $set: {
        'name.firstname': fname,
        'name.lastname': lname,
        'detail.adhar': adhar,
        'detail.position': [lat, lon],
        'detail.age': age,
        'detail.address': addr,
        'detail.gender': gender,
        'detail.phone': phone,
        'detail.city': city,
        'detail.region': region,
        'detail.postcode': post
      }
    }, (err, result) => {
      console.log(err)
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        req.flash('success', 'profile updated 👍')
        res.redirect('/account/user/dash/profile')
      }
    })
  }
  else {
    userSchema.findOneAndUpdate({ 'email': whichuser }, {
      $set: {
        'name.firstname': fname,
        'name.lastname': lname,
        'detail.adhar': adhar,
        'detail.age': age,
        'detail.address': addr,
        'detail.gender': gender,
        'detail.phone': phone,
        'detail.city': city,
        'detail.region': region,
        'detail.postcode': post
      }
    }, (err, result) => {
      console.log(err)
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        req.flash('success', 'profile updated 👍')
        res.redirect('/account/user/dash/profile')
      }
    })
  }
}


userSchema.prototype.bookappo = async (req, res, appoid, userid) => {
  // sleep
  await connect()


  async function awaitUpdate() {
    try {
      appos.findById(appoid).then((doc) => {
        // awaiting resposne
        if (doc.details.slots > 0 && Boolean(doc.status) == false) {
          appos.findByIdAndUpdate(appoid, { $inc: { 'details.slots': '-1' } }, (err, results) => {
            if (err) console.log(err)

            console.log(results)

            const appo = new appolist({
              appoid: appoid,
              userid: userid,
              date: new Date()
            })

            appo.save((err, result) => {
              if (err) console.error(err)

              console.log(result)
              // req.flash('msg', "Appointment Booked")
              res.json({ status: '200' })
              user_bookappo(req.user.email, req.user.username, results)
              return results
            })
          })
        } else {
          // req.flash('err', "Appointment Was Not Booked")
          res.json({ status: '404' })
        }
      })

    }
    catch (err) {
      handleError(err);
    }
  }

  let appoupdate = await awaitUpdate()
  console.log(appoupdate + " asdas")

}

module.exports = { userSchema }
