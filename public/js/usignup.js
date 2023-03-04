$(window).on('load', () => {
    $('.preload').fadeOut(1400);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

flag_0 = 0
flag_1 = 0

$('form').on('submit', (e) => {
    $('#signup').attr('disabled', true)
    setTimeout(() => {
        $('#signup').attr('disabled', false);
    }, 2000)
})


// username val
$('#username').on('input', () => {
    console.log($('#username').val().length)
    if ($('#username').val() != '' && $('#username').val().length > 5) {
        $('#username-msg').hide();
        flag_0 = 1;
    } else {
        $('#signup').prop('disabled', true);
        $('#username-msg').html("<span style=\"color:red\">Username Too Short</span>");
        $('#username-msg').fadeIn(400);
        flag_0 = 0;
    }
});

// username val
$('#username').on('focusout', () => {
    const token = $('#_csrf').val();
    console.log($('#username').val())
    $.ajax({
        url: '/account/user/check',
        type: 'POST',
        data: {
            '_csrf': token,
            'username': $('#username').val()
        },
        success: function (res) {
            console.log("success")

            if (res.status === 'found') {
                $('#signup').prop('disabled', true);
                $('#username-msg').html("<span style=\"color:red\">Try Different Username</span>");
                $('#username-msg').fadeIn(400);
                flag_0 = 0;
            } else {
                $('#username-msg').hide();
                flag_0 = 1;
            }
        }
    });
})

// email val
$('#email').on('input', () => {
    if ($('#email').val() != '' && $('#email').val().length > 5 && $('#email').val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        $('#email-msg').hide();
        flag_1 = 1
    } else {
        $('#signup').prop('disabled', true);
        $('#email-msg').html("<span style=\"color:red\">Valid Email ?</span>");
        $('#email-msg').fadeIn(400);
        flag_1 = 0
    }
});

// username val
$('#email').on('focusout', () => {
    const token = $('#_csrf').val();
    console.log($('#email').val())
    $.ajax({
        url: '/account/user/checkmail',
        type: 'POST',
        data: {
            '_csrf': token,
            'email': $('#email').val()
        },
        success: function (res) {
            $("#flag").html("Done").css('color', 'green')

            if (res.status === 'found') {
                $('#signup').prop('disabled', true);
                $('#email-msg').html("<span style=\"color:red\">Email Already Registerd</span>");
                $('#email-msg').fadeIn(400);
                flag_1 = 0
            } else {
                $('#email-msg').hide();
                flag_1 = 1;
            }
        }
    });
})

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

setInterval(() => {
    if (flag_0 == 1 && flag_1 == 1) {
        $('#signup').prop('disabled', false);
    } else {
        $('#signup').prop('disabled', true);
    }
    console.log(122323)
}, 900)
