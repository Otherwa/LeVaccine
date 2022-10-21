function splitScroll() {
    const controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        duration: '200%',
        triggerElement: '.education-title',
        triggerHook: 0
    }).setPin('.education-title').addTo(controller);
}

splitScroll();