const providerSchema = require('../providerschema')
const reset_user_pass = require('../reset_pass')
const appoSchema = require('../apposchema')
const appolistSchema = require('../appolistschema')
const stonks = require('../stonks')
const orders = require('../orders')
const { connect } = require('../../config/connect')

const {
    bcrypt,
    jwt,
    sendSignupEmail1,
    provider_reset,
    generateOTP,
    sendrecept
} = require('../../commonfunctions/commonfunc')
const { producerSchema } = require('./producer_meth')
// login
providerSchema.prototype.login = async (req, res, username, password) => {
    await connect()

    const provider = await providerSchema.findOne({ username }).lean()
    // console.log(user);
    if (provider != null) {
        try {
            const data = await bcrypt.compare(password, provider.password)
            // if both match than you can do anything
            if (data) {
                // return res.status(200).json({ msg: "Login success" })
                const token = jwt.sign(
                    provider,
                    require('../../config/connection_config').jwt_token
                )
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                res.cookie('type', "Provider", {
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 2 hrs login
                    httpOnly: true
                })
                // console.log(res.cookie);
                res.redirect('/account/provider/dash')
            } else {
                req.flash('message', 'Wrong Password')
                res.redirect('/account/provider')
            }
        } catch (err) {
            res.send({ msg: 'somethings wrong' })
        }
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
    if (username.length > 0 && email.length > 0 && password.length > 0) {
        const exists = await providerSchema.exists({ email })
        if (exists) {
            req.flash('message', 'Account Exsist')
            res.redirect('/account/provider')
        } else {
            try {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)

                const provider = new providerSchema({
                    username,
                    email,
                    password: hash
                })

                await provider.save()
                // console.log(result)
                sendSignupEmail1(email)
                req.flash('message1', 'Login 🛐')
                res.redirect('/account/provider')
            } catch (err) {
                console.log(err)
                req.flash('message1', 'Dude that\'s not cool')
                res.redirect('/account/provider/signup')
            }
        }
    } else {
        req.flash('message1', 'Not Valid Dude')
        res.redirect('/account/user/signup')
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
providerSchema.prototype.setappo = async (req, res, lat, lon, check, byid, addr, city, state, postcode, vaccine, slots, time, date) => {

    console.log(check);
    console.log(byid);
    console.log(date);
    // check if the user is authenticated or not
    if (check == true) {
        await connect()
        // check date
        if (new Date(date) >= new Date()) {
            const appo = new appoSchema({
                byappo: byid,
                address: addr,
                city: city,
                state: state,
                postcode: postcode,
                details: {
                    time: time,
                    vaccine: vaccine,
                    date: date,
                    position: [lat, lon],
                    slots: slots
                },
                status: false
            })

            // check if any require filed is not filled  2 measure
            appo.save((err, result) => {
                if (err) {
                    console.log(err)
                    req.flash('messagesetappo', 'Fill up the Required Fields 👾')
                    res.redirect('/account/provider/dash/setappo')
                } else {
                    // console.log(result)
                    req.flash('messagesetappo', 'Appontment Set Sucessfully 🛐')
                    res.redirect('/account/provider/dash/setappo')
                }
            })
        } else {
            req.flash('messagesetappo', 'Appointment Can be Only be Set One Day Prior')
            res.redirect('/account/provider/dash/setappo')
        }
    } else {
        req.flash('messagesetappo', 'Get Authorized')
        res.redirect('/account/provider/dash/setappo')
    }
}

providerSchema.prototype.profile = async (req, res, lat, lon, whichuser, fname, lname, adhar, age, addr, gender, phone, city, region, post, ngo, ngoaddress) => {
    await connect()
    console.log(whichuser)
    console.log(post)
    var lat = parseFloat(lat)
    var lon = parseFloat(lon)
    // if adhar uploaded
    if (adhar != " ") {
        providerSchema.updateOne({ 'email': whichuser }, { $set: { 'personstatus': true } }, (err, result) => {
            if (err) { console.log(err) }
        })
    }

    // check if image uploaded or not 2 measure
    if (lat != 0 && lon != 0) {
        providerSchema.findOneAndUpdate({ 'email': whichuser }, {
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
                'detail.ngo': ngo,
                'detail.ngoaddress': ngoaddress,
            }
        }, (err, result) => {
            console.log(err)
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                req.flash('success', 'profile updated 👍')
                res.redirect('/account/provider/dash/profile')
            }
        })
    } else {
        providerSchema.findOneAndUpdate({ 'email': whichuser }, {
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
                'detail.ngo': ngo,
                'detail.ngoaddress': ngoaddress,
            }
        }, (err, result) => {
            console.log(err)
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                req.flash('success', 'profile updated 👍')
                res.redirect('/account/provider/dash/profile')
            }
        })
    }
}


// stop appointemts
providerSchema.prototype.stopappo = async (req, res, id) => {
    appoSchema.findByIdAndUpdate(id, { status: true }, () => {
        res.json({ stopped: "done" })
    })
}

// stop appointemts
providerSchema.prototype.startappo = async (req, res, id) => {
    appoSchema.findByIdAndUpdate(id, { status: false }, () => {
        res.json({ stopped: "done" })
    })
}

// stop appointemts
providerSchema.prototype.check = async (req, res, id, userid) => {
    appolistSchema.findOneAndUpdate({ 'appoid': id, 'userid': userid }, { status: true }, () => {
        res.json({ stopped: "done" })
    })
}

// stop appointemts
providerSchema.prototype.buyvaccine = async (req, res, prodid, proid, stonkid, details, vac, status, stock, email) => {

    const data = await stonks.findById(stonkid)
    console.log(data)
    if (data.stocks > 0) {
        await stonks.findByIdAndUpdate(stonkid, { $inc: { stocks: -Number(stock) } })
        const result = await new orders({
            prodid: prodid,
            proid: proid,
            stonkid: stonkid,
            details: details,
            vaccinecode: vac,
            status: status,
            stock: stock,
            date: new Date()
        }).save()
        const producerData = await producerSchema.findById(prodid)
        sendrecept(email, result, producerData)
        res.send(result)
    } else {
        res.send('no')
    }

}

module.exports = { providerSchema }
