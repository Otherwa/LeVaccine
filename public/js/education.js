function splitScroll() {
    const controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        duration: '150%',
        triggerElement: '.education-title',
        triggerHook: 0,

    }).setPin('.education-title').addTo(controller);
}

splitScroll();

ScrollReveal({ reset: true });

let config = {
    delay: 475,
    distance: '10px',
    duration: 500,
    useDelay: 'always',
}

ScrollReveal().reveal($(".education-pages"), config);
ScrollReveal().reveal($(".education-title"), config);