ScrollReveal({ reset: true });

let config = {
    delay: 375,
    duration: 500,
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


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    console.log("mobile device");
    $(window).on("load", function () {
        $('.preload').fadeOut(1000);
    });
} else {
    // false for not mobile device
    console.log("not mobile device");
    // smooth  in /butter definition
    $(window).on("load", function () {
        $('.preload').fadeOut(1000);
        butter.init();
    });
}
// user login
ScrollReveal().reveal($(".form h1"), { delay: 800, origin: 'right', distance: '25px' }, config1);
ScrollReveal().reveal($(".form "), { delay: 700, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".div"), { delay: 800, origin: 'top', distance: '25px' }, config1);

// contact
ScrollReveal().reveal($(".contact-box"), { delay: 700, origin: 'bottom', distance: '25px' }, config1);
// services & which login
ScrollReveal().reveal($(".card"), { delay: 700, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".main"), { delay: 600, origin: 'top', distance: '25px' }, config1);
ScrollReveal().reveal($(".side"), { delay: 800, origin: 'right', distance: '25px' }, config1);
ScrollReveal().reveal($(".img"), { delay: 1000, origin: 'left', distance: '25px' }, config1);

// counter
ScrollReveal().reveal($(".search"), { delay: 600, origin: 'top', distance: '25px' }, config1);
ScrollReveal().reveal($(".txt"), { delay: 600, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".contian-stats"), { delay: 800, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".history-data"), { delay: 900, origin: 'right', distance: '25px' }, config1);
// education
ScrollReveal().reveal($(".container"), { delay: 800, origin: 'bottom', distance: '25px' }, config);
//about
// pages shift
ScrollReveal().reveal($("#hero-image"), config1);
ScrollReveal().reveal($(".home-header1"), config1);
ScrollReveal().reveal($(".education-title"), { delay: 600, origin: 'top', distance: '25px' }, config1);
ScrollReveal().reveal($(".container1"), { delay: 600, origin: 'top', distance: '25px' }, config1);
ScrollReveal().reveal($(".container2"), { delay: 600, origin: 'left', distance: '25px' }, config1);
ScrollReveal().reveal($(".container3"), { delay: 600, origin: 'right', distance: '25px' }, config1);
ScrollReveal().reveal($(".container4"), { delay: 600, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".side"), config1);
ScrollReveal().reveal($(".content h1"), { delay: 850, origin: 'bottom', distance: '35px' }, config1);
ScrollReveal().reveal($(".content"), { delay: 800, origin: 'right', distance: '35px' }, config1);
ScrollReveal().reveal($(".home-footer"), { delay: 700, origin: 'bottom', distance: '25px' }, config);

//index
// pages shift
ScrollReveal().reveal($("#hero-image"), config);
ScrollReveal().reveal($(".home-header1"), config1);
ScrollReveal().reveal($(".home-container05"), config);
ScrollReveal().reveal($(".home-text"), { delay: 900, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".home-btn-group1"), { delay: 500, origin: 'top', distance: '25px' }, config);
ScrollReveal().reveal($(".home-text02"), { delay: 500, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".home-text01"), { delay: 500, origin: 'top', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container06"), { delay: 500, origin: 'left', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container08"), { delay: 500, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".home-image3"), { delay: 500, origin: 'right', distance: '25px' }, config);
ScrollReveal().reveal($(".home-text23"), { delay: 500, origin: 'top', distance: '25px' }, config);
ScrollReveal().reveal($(".home-gallery"), { delay: 500, origin: 'bottom', distance: '25px' }, config);
// inside tiles
ScrollReveal().reveal($(".home-container09"), { delay: 600, origin: 'left', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container11"), { delay: 600, origin: 'right', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container13"), { delay: 600, origin: 'top', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container15"), { delay: 600, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".home-container17"), { delay: 600, origin: 'right', distance: '25px' }, config);
ScrollReveal().reveal($(".home-steps"), { delay: 600, origin: 'bottom', distance: '25px' }, config);
ScrollReveal().reveal($(".con"), { delay: 600, origin: 'top', distance: '25px' }, config);
ScrollReveal().reveal($(".home-footer"), { delay: 600, origin: 'bottom', distance: '25px' }, config);

const options = {
    bottom: '64px', // default: '32px'
    right: 'unset', // default: '32px'
    right: '32px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#eeeeee', // default: '#fff'
    backgroundColor: '#ffffff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: true, // default: true,
    label: '💡', // default: ''
    autoMatchOsTheme: false, // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

//scroll bar progress on scroll increade the width easy in %
const scrollProgress = document.getElementById('scroll-progress');
const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});