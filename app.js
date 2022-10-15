// basic libs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var axios = require('axios');

// routes for all action idividual
const accountRouter = require('./routes/accountrouter')

// ports
const port = process.env.PORT || 8080;











// start init
const app = express();
// db con
// mongoose.connect('mongodb://localhost:27017/DRugs', { useNewUrlParser: true })
mongoose.connect('mongodb+srv://Otherwa:vLsLS2jXafe4Nb6n@cluster0.wijcrrf.mongodb.net/Drugs', { useNewUrlParser: true })
const db = mongoose.connection;
db.on("error", () => { console.log("error in conection"); })
db.once('open', () => { console.log("Connected"); })

//render for htmls
app.set('view engine', 'ejs')

//css js etc flies
app.use(express.static('public'))

//idk
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//account
app.use('/account', accountRouter)


// default route
app.get('/', (req, res) => {
    res.render('index', { title: "Le-Vaccine" })
})

// education
app.get('/education', (req, res) => {
    res.render('education', { title: "Education" })
})

//far cry API retrivel
app.get('/api/:username', (req, res) => {
    let config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-wekqv/endpoint/data/v1/action/find',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'atL6BCofYg4y64buefRdEdDmZHNowkk5hFoOB40b9Lve1zUjQqM7lbScNLDZGmGj',
        },
        data: {
            "collection": "users",
            "database": "Drugs",
            "dataSource": "Cluster0",
            "filter": {
                "username": req.params.username
            }
        }
    }
    //get api val
    axios(config)
        .then(function (response) {
            let data = response.data;
            res.json(data.documents[0]);
        })
        .catch(function (error) {
            console.log(error);
        });
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