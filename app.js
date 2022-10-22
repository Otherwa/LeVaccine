
const express = require('express'); // basic libs
const bodyParser = require('body-parser'); // render
const { connect, dis } = require('./config/connect');
const { sendmail, sendnews, sendedunews } = require('./commonfunctions/commonfunc');
const usersemails = require('./models/useremails'); // models


// routes for all action idividual
const accountRouter = require('./routes/accountrouter')

// ports
const port = process.env.PORT || 8080;

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

//account routes
app.use('/account', accountRouter)


// default route
app.get('/', async (req, res) => {
    // GET
    const data = await sendnews();
    // console.log(data.articles);
    res.render('index', { data: data.articles })
})

// email Register
app.post('/', async (req, res) => {
    // post ajax in index.js
    await connect();
    // console.log(req.body)
    const userData = new usersemails({
        email: req.body.email,
        pos: [parseFloat(req.body.lat), parseFloat(req.body.lon)],
        date: req.body.date
    })

    var user_check = usersemails.findOne({ email: req.body.email })
    if (req.body.email === user_check.email) {
        console.log("error")
    } else {
        // subscriber added
        userData.save(err => {
            if (err) {
                res.send({ alreadysubscribed: "404" }).status(404)
            } else {
                res.send({ alreadysubscribed: "200" }).status(200)
            }
        });
        // await dis()
    }
    // email sent
    sendmail(req.body.email);

});

// education
app.get('/education', async (req, res) => {
    const data = await sendedunews();
    console.log(data.articles);
    // console.log(data)
    res.render('education', { data: data.articles })
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
    res.render('about')
})

app.listen(port);
