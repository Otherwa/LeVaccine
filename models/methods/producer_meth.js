const producerSchema = require('../producerschema')
const stonks = require('../stonks')
const reset_user_pass = require('../reset_pass')
const { connect } = require('../../config/connect')
// implemented usermodel added methods in prototype and create a instanceof user
require('dotenv').config()
const {
    bcrypt,
    jwt,
    sendSignupEmail2,
    producer_reset,
    generateOTP
} = require('../../commonfunctions/commonfunc')

// function
const providerSchema = require('../providerschema')

const orders = require('../orders')
// login
producerSchema.prototype.login = async (req, res, username, password) => {
    await connect()

    const producer = await producerSchema.findOne({ username }).lean()
    // console.log(user);
    if (producer != null) {
        bcrypt.compare(password, producer.password, function (err, data) {
            if (err) res.send({ msg: 'somethings wrong' })
            // if both match than you can do anything
            if (data) {
                // return res.status(200).json({ msg: "Login success" })
                const token = jwt.sign(
                    producer,
                    require('../../config/connection_config').jwt_token
                )
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                res.cookie('type', "Producer", {
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                // console.log(res.cookie);
                res.redirect('/account/producer/dash')
            } else {
                req.flash('message', 'Wrong Password')
                res.redirect('/account/producer')
            }
        })
    } else {
        req.flash('message', 'No such user exsist')
        res.redirect('/account/producer')
    }
}

// logout using cookies jwt hash protection
producerSchema.prototype.logout = async (req, res) => {
    res.clearCookie('jwt') // clear cookie
    res.redirect('/account/producer')
}

// sign up pass hash
producerSchema.prototype.signup = async (req, res, username, email, password, key) => {
    if (key == process.env.KEY) {
        if (username.length > 0 && email.length > 0 && password.length > 0) {
            await connect()
            console.log(email + 'email: ' + username)

            const exists = await producerSchema.exists({ email })
            if (exists) {
                req.flash('message', 'Account Exsist')
                res.redirect('/account/producer')
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) return next(err)
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) return next(err)

                        const producer = new producerSchema({
                            username,
                            email,
                            password: hash
                        })

                        producer.save((err, result) => {
                            if (err) {
                                console.log(err)
                                req.flash('message1', 'Dude that\'s not cool')
                                res.redirect('/account/producer/signup')
                            } else {
                                // console.log(result)
                                sendSignupEmail2(email)
                                req.flash('message1', 'Login 🛐')
                                res.redirect('/account/producer')
                            }
                        })
                    })
                })
            }
        } else {
            req.flash('message1', 'Not Valid Dude')
            res.redirect('/account/user/signup')
        }
    } else {
        req.flash('message1', 'Key Not Valid')
        res.redirect('/account/producer/signup')
    }
}

producerSchema.prototype.reset_otp = async (req, res, email, username) => {
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

    producer_reset(email, username, key)
}


producerSchema.prototype.profile = async (req, res, lat, lon, whichuser, fname, lname, adhar, age, addr, gender, phone, city, region, post) => {
    await connect()
    console.log(whichuser)
    console.log(post)
    var lat = parseFloat(lat)
    var lon = parseFloat(lon)

    // if adhar uploaded
    if (adhar != " ") {
        producerSchema.updateOne({ 'email': whichuser }, { $set: { 'personstatus': true } }, (err, result) => {
            if (err) { console.log(err) }
        })
    }

    // check if image uploaded or not 2 measure
    if (lat != 0 && lon != 0) {
        producerSchema.findOneAndUpdate({ 'email': whichuser }, {
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
                'detail.postcode': post,
            }
        }, (err, result) => {
            console.log(err)
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                req.flash('success', 'profile updated 👍')
                res.redirect('/account/producer/dash/profile')
            }
        })
    } else {
        producerSchema.findOneAndUpdate({ 'email': whichuser }, {
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
                'detail.postcode': post,
            }
        }, (err, result) => {
            console.log(err)
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                req.flash('success', 'profile updated 👍')
                res.redirect('/account/producer/dash/profile')
            }
        })
    }

}

// authorize provider
producerSchema.prototype.authorize = async (req, res, id) => {
    providerSchema.findByIdAndUpdate(id, { auth: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ 'status': 'ok' })
        }
    })
}

// unauthorize provider
producerSchema.prototype.unauthorize = async (req, res, id) => {
    providerSchema.findByIdAndUpdate(id, { auth: false }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ 'status': 'ok' })
        }
    })
}

// set stonks
producerSchema.prototype.setstonk = async (req, res, prodid, vacname, vaccode, des, effec, stock, agai) => {
    const stonk = new stonks({
        prodid: prodid,
        vaccine: vacname,
        vaccinecode: vaccode,
        description: des,
        effectiveness: effec,
        stocks: stock,
        against: agai
    })

    stonk.save().then(result => {
        // req.flash('msgstonks', 'stock set 👍')
        console.log(result)
        // res.redirect('/account/producer/dash/setstonks')
        stonks.find({ 'prodid': prodid }).sort({ '_id': 1 }).then(result => {
            res.json(result)
        })
    })
}

// delete stonks

producerSchema.prototype.deletestonk = async (req, res, id) => {
    stonks.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ 'status': 'ok' })
        }
    })
}

// update stonk
producerSchema.prototype.updatestonk = async (req, res, id, vac, vaccode, des, effec, stock, agai) => {
    stonks.findByIdAndUpdate(id, { 'vaccine': vac, 'vacccinecode': vaccode, 'description': des, 'effectiveness': effec, 'stocks': stock, 'against': agai }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json(docs)
        }
    })
}

// update stonk
producerSchema.prototype.updateorder = async (req, res, id, status) => {
    orders.findByIdAndUpdate(id, { 'status': status }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json(docs)
        }
    })
}

// update stonk
producerSchema.prototype.deleteorder = async (req, res, id, status) => {
    orders.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json(docs)
        }
    })
}

// logout using cookies jwt hash protection
producerSchema.prototype.logout = async (req, res) => {
    res.clearCookie('jwt') // clear cookie
    res.redirect('/account/producer')
}


module.exports = { producerSchema }