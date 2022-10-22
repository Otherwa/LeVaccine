const Nodemailer = require('nodemailer');//mailOptions
const fetch = require('node-fetch');//for fetch api
htmlcontent = require('../config/connection_config').htmlcontent

function sendmail(email) {
    // console.log(email)
    var transporter = Nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'levaccine69@gmail.com',
            pass: 'wjfofdrbrqgumdgx'
        }
    });

    var mailOptions = {
        from: 'levaccine69@gmail.com',
        to: email,
        subject: 'Thanks For Subscribing to us',
        text: 'Thanks For Subscribing to us',
        html: htmlcontent
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendnews() {
    let data = fetch('https://newsapi.org/v2/everything?q=(Vaccines OR Medical)&pageSize=6&sortBy=publishedAt&language=en&apiKey=550660667a8646b08d2de09b578f1aa6')
        .then((response) => response.json())
        .then(data => {
            // do some stuff
            return data;
        })
        .catch(error => {
            return error;
        });

    return data;
}

function sendedunews() {
    let data = fetch('https://newsapi.org/v2/everything?q=medical&pageSize=3&sortBy=publishedAt&language=en&apiKey=550660667a8646b08d2de09b578f1aa6')
        .then((response) => response.json())
        .then(data => {
            // do some stuff
            return data;
        })
        .catch(error => {
            return error;
        });

    return data;
}


module.exports = { sendmail, sendnews, sendedunews }