
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


var flag = 0;
// when a geolocate event occurs.


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


