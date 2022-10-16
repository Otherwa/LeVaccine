$('#error').hide();
$('#subscribed').hide();


const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

ScrollReveal({ reset: true });
let config = {
    delay: 375,
    duration: 500,
    viewFactor: 0.5,
    useDelay: 'always',
    origin: 'bottom',
    distance: '50px'
}

let config1 = {
    delay: 475,
    duration: 500,
    useDelay: 'always',
}

let config2 = {
    delay: 475,
    duration: 650,
    useDelay: 'always',
    scale: '0.99',
    origin: 'right',
    distance: '50px'
}

// pages shift
ScrollReveal().reveal($("#hero-image"), config);
ScrollReveal().reveal($(".home-header1"), config1);
ScrollReveal().reveal($(".home-container05"), config2);
ScrollReveal().reveal($(".home-text"), { delay: 600, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container06"), { delay: 600, origin: 'left', distance: '25px' }, config);


// if value valid send to mongo subscribe collection
$('#emailclick').click(() => {
    const email = $('#emailval').val();
    const date = new Date();
    if (validateEmail(email)) {
        console.log(email);
        $.ajax({
            url: '/',
            type: 'POST',
            data: { email: email, date: date },
            success: function (res) {
                console.log(res)
                if (res.alreadysubscribed == "404") {
                    $('#subscribed').show().text("already exists");
                } else {
                    $('#subscribed').show().text("Registerd");
                    $('#error').hide();
                }
            }
        })
    }
    else {
        $('#subscribed').hide();
        $('#error').show();
    }
});