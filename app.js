// basic libs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.listen(port);