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

// smooth  in /butter definition
butter.init();

// darkmode
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

//scroll bar progress on scroll increade the width easy in %
const scrollProgress = document.getElementById('scroll-progress');
const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});
