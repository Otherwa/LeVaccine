const userSchema = require('../userschema')
const reset_user_pass = require('../reset_pass')
const { connect } = require('../../config/connect')
const {
  bcrypt,
  jwt,
  sendSignupEmail,
  user_reset,
  generateOTP
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
          expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs login
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
          password: hash
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

module.exports = { userSchema }
