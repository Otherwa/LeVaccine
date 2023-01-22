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
        $('.preload').fadeOut(2000);
    });
} else {
    // false for not mobile device
    console.log("not mobile device");
    // smooth  in /butter definition
    $(window).on("load", function () {
        $('.preload').fadeOut(2000);
        butter.init();
    });
}

// api
ScrollReveal().reveal($(".api-con"), { delay: 700, distance: '25px', origin: 'bottom' }, config1);
//book appo
ScrollReveal().reveal($(".appos"), { delay: 700, distance: '25px', origin: 'bottom' }, config1);
ScrollReveal().reveal($(".listofappo"), { delay: 700, distance: '25px', origin: 'bottom' }, config1);

// user dash
ScrollReveal().reveal($(".info"), { delay: 700, distance: '25px', origin: 'bottom' }, config1);
ScrollReveal().reveal($("#appos"), { delay: 700, distance: '25px', origin: 'bottom' }, config1);
// user login
ScrollReveal().reveal($(".form h1"), { delay: 800, origin: 'right', distance: '25px' }, config1);
ScrollReveal().reveal($(".header1"), { delay: 900, origin: 'top', distance: '25px' }, config1);
ScrollReveal().reveal($(".form "), { delay: 700, origin: 'bottom', distance: '25px' }, config1);
ScrollReveal().reveal($(".div"), { delay: 800, origin: 'top', distance: '25px' }, config1);
//dash all
ScrollReveal().reveal($(".heading"), { delay: 900, origin: 'top', distance: '25px' }, config1);
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
    right: '52px', // default: 'unset'
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

// share api
const shareData = {
    title: 'Le-Vaccine',
    text: 'Let\'s Get Vaccinated!',
    url: 'https://drug-lord.onrender.com/'
}


// open peeps Super Duper Hard

const Config = {
    src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png',
    rows: 15,
    cols: 7
}

// UTILS

const randomRange = (min, max) => min + Math.random() * (max - min)

const randomIndex = (array) => randomRange(0, array.length) | 0

const removeFromArray = (array, i) => array.splice(i, 1)[0]

const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item))

const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array))

const getRandomFromArray = (array) => (
    array[randomIndex(array) | 0]
)

// super hard 
const resetPeep = ({ stage, peep }) => {
    const direction = Math.random() > 0.5 ? 1 : -1
    // using an ease function to skew random to lower values to help hide that peeps have no legs
    const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
    const startY = stage.height - peep.height + offsetY
    let startX
    let endX

    if (direction === 1) {
        startX = -peep.width
        endX = stage.width
        peep.scaleX = 1
    } else {
        startX = stage.width + peep.width
        endX = 0
        peep.scaleX = -1
    }

    peep.x = startX
    peep.y = startY
    peep.anchorY = startY

    return {
        startX,
        startY,
        endX
    }
}

const normalWalk = ({ peep, props }) => {
    const {
        startX,
        startY,
        endX
    } = props

    const xDuration = 10
    const yDuration = 0.25

    const tl = gsap.timeline()
    tl.timeScale(randomRange(0.5, 1.5))
    tl.to(peep, {
        duration: xDuration,
        x: endX,
        ease: 'none'
    }, 0)
    tl.to(peep, {
        duration: yDuration,
        repeat: xDuration / yDuration,
        yoyo: true,
        y: startY - 10
    }, 0)

    return tl
}

const walks = [
    normalWalk,
]

// CLASSES

class Peep {
    constructor({
        image,
        rect,
    }) {
        this.image = image
        this.setRect(rect)

        this.x = 0
        this.y = 0
        this.anchorY = 0
        this.scaleX = 1
        this.walk = null
    }

    setRect(rect) {
        this.rect = rect
        this.width = rect[2]
        this.height = rect[3]

        this.drawArgs = [
            this.image,
            ...rect,
            0, 0, this.width, this.height
        ]
    }

    render(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scaleX, 1)
        ctx.drawImage(...this.drawArgs)
        ctx.restore()
    }
}

// MAIN

const img = document.createElement('img')
img.onload = init
img.src = Config.src

const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')

const stage = {
    width: 0,
    height: 0,
}

const allPeeps = []
const availablePeeps = []
const crowd = []

function init() {
    createPeeps()

    // resize also (re)populates the stage
    resize()

    gsap.ticker.add(render)
    window.addEventListener('resize', resize)
}

function createPeeps() {
    const {
        rows,
        cols
    } = Config
    const {
        naturalWidth: width,
        naturalHeight: height
    } = img
    const total = rows * cols
    const rectWidth = width / rows
    const rectHeight = height / cols

    for (let i = 0; i < total; i++) {
        allPeeps.push(new Peep({
            image: img,
            rect: [
                (i % rows) * rectWidth,
                (i / rows | 0) * rectHeight,
                rectWidth,
                rectHeight,
            ]
        }))
    }
}

function resize() {
    stage.width = canvas.clientWidth
    stage.height = canvas.clientHeight
    canvas.width = stage.width * devicePixelRatio
    canvas.height = stage.height * devicePixelRatio

    crowd.forEach((peep) => {
        peep.walk.kill()
    })

    crowd.length = 0
    availablePeeps.length = 0
    availablePeeps.push(...allPeeps)

    initCrowd()
}

function initCrowd() {
    while (availablePeeps.length) {
        // setting random tween progress spreads the peeps out
        addPeepToCrowd().walk.progress(Math.random())
    }
}

function addPeepToCrowd() {
    const peep = removeRandomFromArray(availablePeeps)
    const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
            peep,
            stage,
        })
    }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep)
        addPeepToCrowd()
    })

    peep.walk = walk

    crowd.push(peep)
    crowd.sort((a, b) => a.anchorY - b.anchorY)

    return peep
}

function removePeepFromCrowd(peep) {
    removeItemFromArray(crowd, peep)
    availablePeeps.push(peep)
}

function render() {
    canvas.width = canvas.width
    ctx.save()
    ctx.scale(devicePixelRatio, devicePixelRatio)

    crowd.forEach((peep) => {
        peep.render(ctx)
    })

    ctx.restore()
}
