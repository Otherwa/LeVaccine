ScrollReveal({ reset: true });

let config = {
    delay: 475,
    distance: '50px',
    duration: 500,
    useDelay: 'always',
}

$(window).on('load', () => {
    $('.preload').fadeOut(1500);
})

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

ScrollReveal().reveal($(".container"), config);

// mobile check
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    console.log("mobile device");
} else {
    // false for not mobile device
    console.log("not mobile device");
    // smooth  in /butter definition
    butter.init();
}