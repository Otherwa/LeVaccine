const providerSchema = require('../providerschema')
const reset_user_pass = require('../reset_pass')
const appoSchema = require('../apposchema')
const { connect } = require('../../config/connect')

const {
    bcrypt,
    jwt,
    sendSignupEmail1,
    provider_reset,
    generateOTP
} = require('../../commonfunctions/commonfunc')
// login
providerSchema.prototype.login = async (req, res, username, password) => {
    await connect()

    const provider = await providerSchema.findOne({ username }).lean()
    // console.log(user);
    if (provider != null) {
        bcrypt.compare(password, provider.password, function (err, data) {
            if (err) res.send({ msg: 'somethings wrong' })
            // if both match than you can do anything
            if (data) {
                // return res.status(200).json({ msg: "Login success" })
                const token = jwt.sign(
                    provider,
                    require('../../config/connection_config').jwt_token
                )
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                res.cookie('type', "Provider", {
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                // console.log(res.cookie);
                res.redirect('/account/provider/dash')
            } else {
                req.flash('message', 'Wrong Password')
                res.redirect('/account/provider')
            }
        })
    } else {
        req.flash('message', 'No such user exsist')
        res.redirect('/account/provider')
    }
}

// logout using cookies jwt hash protection
providerSchema.prototype.logout = async (req, res) => {
    res.clearCookie('jwt') // clear cookie
    res.redirect('/account/provider')
}

// sign up pass hash
providerSchema.prototype.signup = async (req, res, username, email, password) => {
    await connect()
    console.log(email + 'email: ' + username)

    const exists = await providerSchema.exists({ email })
    if (exists) {
        req.flash('message', 'Account Exsist')
        res.redirect('/account/provider')
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return next(err)

                const provider = new providerSchema({
                    username,
                    email,
                    password: hash
                })

                provider.save((err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(result)
                        sendSignupEmail1(email)
                        req.flash('message1', 'Login 🛐')
                        res.redirect('/account/provider')
                    }
                })
            })
        })
    }
}

providerSchema.prototype.reset_otp = async (req, res, email, username) => {
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

    provider_reset(email, username, key)
}

// set appontments
providerSchema.prototype.setappo = async (req, res, check, byid, addr, city, state, postcode, vaccine, time, date) => {

    console.log(check);
    console.log(byid);
    console.log(date);
    // check if the user is authenticated or not
    if (check == 'true') {
        await connect()
        const appo = new appoSchema({
            byappo: byid,
            address: addr,
            city: city,
            state: state,
            postcode: postcode,
            details: {
                time: time,
                vaccine: vaccine,
                date: date
            },
        })
        // check if any require filed is not filled  2 measure
        appo.save((err, result) => {
            if (err) {
                console.log(err)
                req.flash('messagesetappo', 'Fill up the Required Fields N****')
                res.redirect('/account/provider/dash/setappo')
            } else {
                // console.log(result)
                req.flash('messagesetappo', 'Appontment 200 🛐')
                res.redirect('/account/provider/dash/setappo')
            }
        })
    } else {
        req.flash('messagesetappo', 'Get Authorized')
        res.redirect('/account/provider/dash/setappo')
    }
}

module.exports = { providerSchema }
