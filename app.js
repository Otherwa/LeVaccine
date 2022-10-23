
const express = require('express'); // basic libs
const bodyParser = require('body-parser'); // render
const { connect, dis } = require('./config/connect');
const { sendmail, sendnews, sendedunews } = require('./commonfunctions/commonfunc');
const usersemails = require('./models/useremails'); // models
const edurls = require('./models/edurls'); // models
const compression = require('compression')

require('events').EventEmitter.prototype._maxListeners = 100;


// routes for all action idividual
const accountRouter = require('./routes/accountrouter');


// ports
const port = process.env.PORT || 8080;

// start init
const app = express();

//render for htmls
app.set('view engine', 'ejs')

//css js etc flies
app.use(express.static('public'))

// compression for fast loads
app.use(compression())

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
    await connect();
    // var data = edurls.findOne({});
    edurls.find({}, { "_id": 0, "url": 1 }, (err, data) => {
        if (err) {
            res.render('error')
        } else {
            edurls.countDocuments({}, (err, usercount) => {
                // console.log(usercount)
                res.render('education', { data: data, count: usercount })
            })

        }
    })
});


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


// apis
app.get('/api/edurls/:url&:apikey', async (req, res) => {

    let youtube = "https://www.youtube.com/embed/"
    let url = youtube + req.params.url
    let apikey = req.params.apikey
    let date = new Date();

    await connect();

    if (apikey == "69420qwerty" || apikey == "supersaiyan1" || apikey == "tatakae") {
        // post ajax in index.js
        // console.log(req.body)
        const edurl = new edurls({
            url: url,
            date: date
        })
        // save
        edurl.save(err => {
            if (err) {
                res.send({ "msg": "Fail", "status": "404", "url": url, "apikey": apikey, "err": err }).status(404)
            } else {
                res.send({ "msg": "Ok", "status": "200", "url": url, "apikey": apikey }).status(404)
            }
        });

    } else {
        res.json({ "msg": "Somethings Wrong" })
    }

})

//error custom
app.get("*", (req, res) => {
    res.render('error')
})

app.listen(port);
