
// libre map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0e4ffb970b8f4957bd7450e8df3b2a49', // stylesheet location
    center: [74.5, 19], // starting position [lng, lat]
    zoom: 3, // starting zoom
    pitch: 30// starting tilt
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


// validations
// address verfication
$('#address').on('input', () => {
    let address = $('#address').val()
    if ((address.length <= 100 && address.length >= 3)) {
        $('#addr_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#addr_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})

$('#city').on('input', () => {
    let city = $('#city').val()
    if ((city.length <= 100 && city.length >= 3)) {
        $('#city_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#city_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})


// post code
$('#postcode').on('input', () => {
    let post = $('#postcode').val()
    if ((post.length <= 6 && post.length >= 6)) {
        $('#post_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#post_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})

$('#state').on('input', () => {
    let state = $('#state').val()
    if ((state.length <= 100 && state.length >= 3)) {
        $('#state_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#state_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})


// post code
$('#postcode').on('input', () => {
    let post = $('#postcode').val()
    if ((post.length <= 6 && post.length >= 6)) {
        $('#post_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#post_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})

// post code
$('#forvaccine').on('input', () => {
    let post = $('#forvaccine').val()
    console.log(post)
    if ((post.length <= 10 && post.length >= 3)) {
        $('#forvaccine_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#forvaccine_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})

// post code
$('#slots').on('input', () => {
    let post = $('#slots').val()
    if ((post <= 20 && post >= 0)) {
        $('#slot_msg').hide('fast');
        $('#signup').prop('disabled', false)
    } else {
        $('#slot_msg').show('fast');
        $('#signup').prop('disabled', true)
    }
})