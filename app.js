// basic libs
const express = require('express');
// mongo connet
const URL = require('./config/connection_config').con;

// mongoose
const mongoose = require('./config/connect');

// render
const bodyParser = require('body-parser');


// routes for all action idividual
const accountRouter = require('./routes/accountrouter')

// ports
const port = process.env.PORT || 8080;

// models
const usersemails = require('./models/useremails');




// start init
const app = express();

//render for htmls
app.set('view engine', 'ejs')

//css js etc flies
app.use(express.static('public'))

//idk parseres
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//account
app.use('/account', accountRouter)


// default route
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    // post ajax in index.js
    console.log(req.body);
    const email = req.body.email
    const date = req.body.date

    const userData = new usersemails({
        email: email,
        date: date
    })
    // subscriber added
    var user_check = usersemails.findOne({ email: email })
    if (email === user_check.email) {
        console.log("error")
    } else {
        userData.save(err => {
            if (err) {
                console.error(err);
                // already subscribed
                res.send({ alreadysubscribed: "404" })
            } else {
                res.send({ alreadysubscribed: "200" })
            }
        });
    }
});


// education
app.get('/education', (req, res) => {
    res.render('education', { title: "Education" })
})


// contact
app.get('/contact', (req, res) => {
    res.render('contact', { title: "Contact" })
})

// blogs
app.get('/blog', (req, res) => {
    res.render('blog', { title: "Blog" })
})

// services
app.get('/services', (req, res) => {
    res.render('services', { title: "Services" })
})

// about
app.get('/about', (req, res) => {
    res.render('contact', { title: "Contact" })
})
app.listen(port);