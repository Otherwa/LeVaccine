$(window).on('load', () => {
    $('.preload').fadeOut(1400);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

$('#username').on('input', () => {
    if ($('#password').val() != '' || $('#password').val().length > 5) {
        $('#signup').prop('disabled', false);
    } else {
        $('#signup').prop('disabled', true);
    }
});

$('#email').on('input', () => {
    if ($('#email').val() != '' || $('#email').val().length > 5) {
        $('#signup').prop('disabled', false);
    } else {
        $('#signup').prop('disabled', true);
    }
});

$('#password').on('input', () => {
    if ($('#password').val().length < 8) {
        $('.div-msg').fadeIn(800);
        $('#pass-msg').html("<span style=\"color:red\">Password must be greater<br> than 8 characters</span>");
        $('#pass-msg').fadeIn(400);
        $('#signup').prop('disabled', true);
    } else {
        $('#pass-msg').html("<span style=\"color:green\">Bread 👍</span>");
        $('#signup').prop('disabled', false);
    }
});