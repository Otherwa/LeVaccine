$(window).scroll(function () {
    console.log("working");
    if (jQuery(this).scrollTop() > 100) {
        jQuery('#ideate').animate({ right: '0px' });
    } else {
        jQuery('#ideate').animate({ right: '550px !important' });
    }
})

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
app.load('https://prod.spline.design/7nwrTT1yrOeOgahM/scene.splinecode');