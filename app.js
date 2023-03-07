require('dotenv').config()
const express = require('express'); // basic libs
const bodyParser = require('body-parser'); // render
const { connect } = require('./config/connect');
const { sendmail, sendnews, covid } = require('./commonfunctions/commonfunc');
const compression = require('compression')
const nocache = require('nocache');
const flash = require('connect-flash');
const session = require('cookie-session');
const cookie = require('cookie-parser');
const generateApiKey = require('generate-api-key').default;
const path = require('path');
const csrf = require('csurf');
const cookieParser = require("cookie-parser")
const appo = require('./models/apposchema')

require('events').EventEmitter.prototype._maxListeners = 900;


// models
const usersemails = require('./models/useremails'); // models
const usersSchema = require('./models/userschema'); // models
const edurls = require('./models/edurls'); // models
const api = require('./models/apis') //model
const rateLimit = require('express-rate-limit')

var limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50
});

// routes for all action idividual
const accountRouter = require('./routes/accountrouter').Router;

const { isauthvalid } = require('./commonfunctions/commonfunc');
const { providerSchema } = require('./models/methods/provider_meth');
const { producerSchema } = require('./models/methods/producer_meth');
const apposchema = require('./models/apposchema');

// open ai
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


// ports
const port = process.env.PORT || 8080;

// start init
const app = express();

const statusMonitor = require('express-status-monitor')();
app.use(statusMonitor);

app.get('/status', statusMonitor.pageRoute)

// session
app.use(session({
    secret: require('./config/connection_config').pass,
    resave: false,
    saveUninitialized: true,
    cookie: { maxage: 6100000 }
}));

// for error flashing
app.use(flash())

app.use(cookie());



//render for htmls
app.set('view engine', 'ejs')
app.set('json spaces', 2)

//css js etc flies
app.use(express.static(__dirname + '/public'))



//no cache session cookie issue more loade time 
app.use(nocache());

// compression for fast loads
app.use(compression())

//idk parseres
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('Tatakae'));
app.use(csrf({ cookie: true }));

// parse application/json
app.use(bodyParser.json())

//account routes
app.use('/account', accountRouter)

// rate limiting
app.use(limiter);

app.set('etag', false)

app.get('/sitemap.xml', (req, res, next) => {
    var fileName = 'sitemap.xml';
    var options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
})

app.get('/robots.txt', (req, res, next) => {
    var fileName = 'robots.txt';
    var options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
})

// health
app.get('/health', async (req, res) => {
    // GET
    res.status(200).send("OK");
})

// default route
app.get('/', async (req, res) => {
    // GET
    const data = await sendnews();
    // console.log(data.articles);
    res.render('index', { data: data.articles, csrf_token: req.csrfToken() });
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
                sendmail(req.body.email);
            }
        });
        // await dis()
    }
    // email sent
});

// education
app.get('/education', async (req, res) => {
    await connect();
    // var data = edurls.findOne({});
    edurls.find({}, { "_id": 0, "url": 1, "date": 1, "description": 1 }, (err, data) => {
        if (err) {
            res.render('error')
        } else {
            // console.log(data)
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
app.get('/counter', async (req, res) => {
    var data = await covid();
    // console.log(data);
    await connect();
    appo.find({ 'status': true }, { 'details.position': 1, '_id': 0 }, (err, result) => {
        const pos = result.map(position);
        // console.log(pos)
        function position(item) {
            return (item.details.position);
        }

        data = data.response;
        res.render('counter', { data: data[0], appo: pos });
    })
    // get base india

})

// services
app.get('/services', (req, res) => {
    res.render('services', { title: "Services" })
})

// about
app.get('/about', (req, res) => {
    res.render('about')
})


// open ai 
app.get('/help', (req, res) => {
    res.render('help', { 'csrf_token': req.csrfToken() });
})

app.post('/help', async (req, res) => {
    let prompt = req.body.prompt;

    await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0, // Higher values means the model will take more risks.
        max_tokens: 2047, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    }).then((data) => {
        console.log(data.data.choices)
        res.json({ message: data.data.choices[0].text });
    }).catch(err => {
        console.log(err)
    })
})

// apis
app.get('/api', isauthvalid, (req, res) => {
    res.render('apis/api', { csrf_token: req.csrfToken() })
})

// api key genration
app.post('/api', async (req, res) => {
    const key = generateApiKey({ method: 'string', min: 10, max: 20 });
    const date = new Date();
    const api_in = new api({
        apikey: key,
        date: date
    })
    await connect();

    api_in.save(err => {
        if (err) {
            console.log(err);
            res.send({ generated: "404" }).status(404)
        } else {
            res.send({ generated: "200", apikey: key }).status(200)
        }
    });
})

// educztion videos update api
app.get('/api/edurls/:url&:des&:apikey', async (req, res) => {

    let youtube = "https://www.youtube.com/embed/"
    let url = youtube + req.params.url
    let apikey = req.params.apikey
    let description = req.params.des
    let date = new Date();

    await connect();
    const exsist = await api.findOne({ apikey: apikey }).lean()
    // gets an object contain
    // console.log(exsist)
    if (exsist != null) {
        // post ajax in index.js
        // console.log(req.body)
        const edurl = new edurls({
            url: url,
            description: description,
            date: date
        })
        // save
        edurl.save(err => {
            if (err) {
                res.send({ "msg": "Fail", "status": "already exsists", "url": url, "apikey": apikey, "err": err }).status(404)
            } else {
                res.send({ "msg": "Ok", "status": "200", "url": url, "apikey": apikey }).status(404)
            }
        });

    } else {
        res.json({ "msg": "Somethings Wrong" })
    }
})

app.get('/api/peoples&:api', async (req, res) => {
    await connect();
    const apikey = req.params.api;
    const exsist = await api.findOne({ apikey: apikey }).lean()
    // gets an object contain
    // console.log(exsist)
    if (exsist != null) {
        usersSchema.find().count((err, user) => {
            if (err) console.log(err)
            console.log(user)
            providerSchema.find().count((err, provider) => {
                if (err) console.log(err)
                console.log(provider)
                producerSchema.find().count((err, producer) => {
                    console.log(producer)
                    res.json({ users: user, provider: provider, producer: producer })
                })
            })
        })
    } else {
        res.json({ msg: 'err' })
    }
    // await dis();
})

app.get('/api/appos&:api', async (req, res) => {
    await connect();
    const apikey = req.params.api;
    const exsist = await api.findOne({ apikey: apikey }).lean()
    // gets an object contain
    // console.log(exsist)
    if (exsist != null) {
        apposchema.find({}, (err, docs) => {
            res.json(docs)
        })
    } else {
        res.json({ msg: 'err' })
    }
    // await dis();
})

//error custom
app.get("*", (req, res) => {
    res.render('error')
})

app.listen(port, () => {
    console.log("Started on port " + port)
});

module.exports = app
