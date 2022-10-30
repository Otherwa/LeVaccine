const userSchema = require('../userschema');
const { connect } = require('../../config/connect');
const { bcrypt, jwt, sendSignupEmail } = require('../../commonfunctions/commonfunc');

// login
userSchema.prototype.login = async (req, res, username, password) => {
    await connect();

    const user = await userSchema.findOne({ username: username }).lean()
    // console.log(user);
    if (user != null) {
        bcrypt.compare(password, user.password, function (err, data) {
            if (err) res.send({ msg: 'somethings wrong' })
            //if both match than you can do anything
            if (data) {
                // return res.status(200).json({ msg: "Login success" })
                const token = jwt.sign(user, require('../../config/connection_config').jwt_token)
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), //2 hrs login
                    httpOnly: true
                });
                // console.log(res.cookie);
                res.redirect('/account/user/dash')
            } else {
                return res.status(401).json({ msg: "Invalid credencial" })
            }
        });
    } else {
        req.flash('message', 'No user exsist')
        res.redirect('/account/user/login');
    }
}

// logout using cookies jwt hash protection
userSchema.prototype.logout = async (req, res) => {
    res.clearCookie('jwt'); //clear cookie
    res.redirect('/account/user/login')
}

// sign up pass hash 
userSchema.prototype.signup = async (req, res, username, email, password) => {
    await connect();
    console.log(email + "email: " + username)

    const exists = await userSchema.exists({ email: email });
    if (exists) {
        res.redirect('/account/user/signup');
        return;
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return next(err);

                const user = new userSchema({
                    username: username,
                    email: email,
                    password: hash
                });

                user.save();
                sendSignupEmail(email);
                res.redirect('/account/user/login');
            });
        });
    }
}

module.exports = { userSchema };