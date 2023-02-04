const e = require("connect-flash");

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0e4ffb970b8f4957bd7450e8df3b2a49', // stylesheet location
    center: [74.5, 19], // starting position [lng, lat]
    zoom: 6,
    pitch: 30 // starting zoom
});

// get location
// Initialize the geolocate control.
const geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

var lng;
var lat;
let flag = 0
geolocate.on('geolocate', function (data) {
    // console.log('A geolocate event has occurred.')
    // get option
    console.log(data);
    lng = data.coords.longitude;
    lat = data.coords.latitude;
    // only one marker as per
    console.log(lng)
    console.log(lat)
    if (flag == 0) {
        marker.setLngLat([lng, lat]).addTo(map);
        flag = 1;
    }
});

let marker = new maplibregl.Marker({
    draggable: true,
    anchor: 'center'
})

function onDragEnd() {
    var lngLat = marker.getLngLat();
    console.log(lngLat);

    var requestOptions = {
        method: 'GET',
    };

    $('#lat').val(lngLat.lat)
    $('#lon').val(lngLat.lng)

    fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lngLat.lat + "&lon=" + lngLat.lng + "&apiKey=0e4ffb970b8f4957bd7450e8df3b2a49", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            $('#address').val(
                result.features[0].properties.address_line1 + "," +
                result.features[0].properties.address_line2)
            $('#city').val(
                result.features[0].properties.city
            )
            $('#postcode').val(
                result.features[0].properties.postcode
            )
            $('#state').val(
                result.features[0].properties.state
            )
            $('#profileset').prop('disabled', false)
        })
        .catch(error => console.log('error', error));
}

function onDragStart() {
    console.log("Drag Started.....")
}

marker.on('dragend', onDragEnd);
marker.on('dragstart', onDragStart);

// controls
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(geolocate);

map.on('load', function () {
    geolocate.trigger();
});


// /adhar verifications/
const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

// permutation table
const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

// verifications
// start verification
$('#profileset').prop('disabled', true)

// FName & LName Validation

$('#fname').on('input', () => {
    var regix_match = /([A-Z])\w+/;
    var value = $('#fname').val()
    if (value.match(regix_match)) {
        $('#fname_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#profileset').prop('disabled', true)
        $('#fname_msg').show('fast');
    }
})

$('#lname').on('input', () => {
    var regix_match = /([A-Z])\w+/;
    var value = $('#lname').val()
    if (value.match(regix_match)) {
        $('#lname_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#lname_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})

// phone number verification
$('#phone').on('input', () => {
    var numbers = /^[0-9]+$/;
    let phone = $('#phone').val()
    if (phone.match(numbers) && (phone.length <= 10 && phone.length >= 10)) {
        $('#phone_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#phone_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})

// address verfication
$('#address').on('input', () => {
    let address = $('#address').val()
    if ((address.length <= 100 && address.length >= 3)) {
        $('#addr_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#addr_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})

// post code
$('#postcode').on('input', () => {
    let post = $('#postcode').val()
    if ((post.length <= 6 && post.length >= 6)) {
        $('#post_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#post_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})

// region
$('#region').on('input', () => {
    let region = $('#region').val()
    if ((region.length <= 100 && region.length >= 3)) {
        $('#region_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#region_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})

// city
// region
$('#city').on('input', () => {
    let city = $('#city').val()
    if ((city.length <= 100 && city.length >= 3)) {
        $('#city_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#city_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})
// age verifiaction
$('#age').on('input', () => {
    let age = $('#age').val()
    if (age < 120 && age > 0) {
        $('#age_msg').hide('fast');
        $('#profileset').prop('disabled', false)
    } else {
        $('#age_msg').show('fast');
        $('#profileset').prop('disabled', true)
    }
})


// validates Aadhar number received as string
function validate(aadharNumber) {
    let c = 0
    let invertedArray = aadharNumber.split('').map(Number).reverse()

    invertedArray.forEach((val, i) => {
        c = d[c][p[(i % 8)][val]]
    })

    return (c === 0)
}

function verify() {
    var aadharNo = $('#adhar').val();
    if (validate(aadharNo)) {
        $('#adhar_msg').hide('fast');
        $('#adhar').css('color', 'blue')
        $('#profileset').prop('disabled', false)
    } else {
        $('#adhar_msg').show('fast');
        $('#adhar').css('color', 'red')
        $('#profileset').prop('disabled', true)
    }
}


$('#adhar').on('input', () => {
    verify();
})

