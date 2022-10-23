ScrollReveal({ reset: true });

let config = {
    delay: 475,
    distance: '50px',
    duration: 500,
    useDelay: 'always',
}

$(window).on('load', () => {
    $('.preload').fadeOut(1900);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

ScrollReveal().reveal($(".container"), config);