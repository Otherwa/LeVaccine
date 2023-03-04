document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

$('form').on('submit', (e) => {
    $('#login').attr('disabled', true)
    setTimeout(() => {
        $('#login').attr('disabled', false);
    }, 2000)
})