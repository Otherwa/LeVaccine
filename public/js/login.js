document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

$('#password').on('input', () => {
    if ($('#password').val().length < 8) {
        $('.div-msg').fadeIn(800);
        $('#pass-msg').html("<span style=\"color:red\">Are you Sure ?</span>");
        $('#pass-msg').fadeIn(400);
    } else {
        $('#pass-msg').html("<span style=\"color:green\">Bread 👍</span>");
    }
});

$('form').on('submit', (e) => {
    $('#login').attr('disabled', true)
    setTimeout(() => {
        $('#login').attr('disabled', false);
    }, 2000)
})