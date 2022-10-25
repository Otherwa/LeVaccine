$(window).on('load', () => {
    $('.preload').fadeOut(1400);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


// $('#login').click(() => {
//     const username = $('#username').val();
//     const password = $('#password').val();
//     $.ajax({
//         url: '/account/user/login',
//         type: 'POST',
//         data: { username: username, password: password },
//         success: function (res) {
//             console.log(res);
//         }
//     })
// }
// );