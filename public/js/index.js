
$('#error').hide();
$('#subscribed').hide();

$(document).ready(() => {
    getLocation();
})

//validates email on subscribtion 
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


ScrollReveal({ reset: true });

// location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log(error);
    }
}

let map;


// for mobile users
var lat = 00;
var lon = 00;

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
}

// if value valid send to mongo subscribe collection
$('#emailclick').click(() => {
    const email = $('#emailval').val();
    $('#emailval').val('')
    console.log($('#csrf').val())
    const date = new Date();
    if (validateEmail(email)) {
        console.log(email);
        $.ajax({
            url: '/',
            type: 'POST',
            data: { '_csrf': $('#csrf').val(), email: email, lat: lat, lon: lon, date: date },
            success: function (res) {
                // console.log(res)
                if (res.alreadysubscribed == "404") {
                    $('#error').hide();
                    $('#subscribed').fadeIn();
                    $('#subscribed code').delay(100).fadeIn().text('Already Subscribed 🛐')
                } else {
                    $('#subscribed').fadeIn()
                    $('#subscribed code').fadeIn().text('Subscribed Sucessfully 🔥')
                    $('#error').hide();
                }
            }
        })
    }
    else {
        $('#subscribed').hide();
        $('#error').fadeIn();
    }
});

// callback
fetch("https://pingback-1-s5803083.deta.app/api/v1/events", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "1bc5d376-b6ab-420b-b4bc-4116042a7e6d",
    },
    body: JSON.stringify({
        project: "Levaccine",
        channel: "default",
        name: "test",
        title: "Page Get 👩‍🚀🚀",
        description: "Noice",
        icon: ":rocket:",
    })
});
