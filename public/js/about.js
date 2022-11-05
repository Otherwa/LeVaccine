$(window).scroll(function () {
    console.log("working");
    if (jQuery(this).scrollTop() > 100) {
        jQuery('#ideate').animate({ right: '0px' });
    } else {
        jQuery('#ideate').animate({ right: '550px !important' });
    }
})