$(window).on('load', () => {
    $('.preload').fadeOut(1400);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


// username val
$('#username').on('input', () => {
    console.log($('#username').val().length)
    if ($('#username').val() != '' && $('#username').val().length > 5) {
        $('#username-msg').hide();
    } else {
        $('#signup').prop('disabled', true);
        $('#username-msg').html("<span style=\"color:red\">Username Too Short</span>");
        $('#username-msg').fadeIn(400);
    }
});

// email val
$('#email').on('input', () => {
    if ($('#email').val() != '' && $('#email').val().length > 5 && $('#email').val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        $('#email-msg').hide();
    } else {
        $('#signup').prop('disabled', true);
        $('#email-msg').html("<span style=\"color:red\">Valid Email ?</span>");
        $('#email-msg').fadeIn(400);
    }
});

$('#password').on('input', () => {
    if ($('#password').val().length > 7 && $('#password').val() != '') {

        if ($('#username').val() != '' && $('email').val() != '' && $('#email').val().length > 5 && $('#email').val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && $('#username').val().length > 5) {
            $('#pass-msg').html("<span style=\"color:green\">Bread 👍</span>");
            $('#signup').prop('disabled', false);
        } else {
            $('#pass-msg').html("<span>Sus 👾</span>");
        }

    } else {
        $('.div-msg').fadeIn(800);
        $('#pass-msg').html("<span style=\"color:red\">Password must be greater<br> than 8 characters</span>");
        $('#pass-msg').fadeIn(400);
        $('#signup').prop('disabled', true);
    }
});


