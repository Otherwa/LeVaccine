// appointemnts all registered
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0e4ffb970b8f4957bd7450e8df3b2a49', // stylesheet location
    center: [74.5, 19], // starting position [lng, lat]
    zoom: 6, // starting zoom
    pitch: 30// starting tilt
});

// get location
const geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});


geolocate.on('geolocate', function (data) {
    console.log('A geolocate event has occurred.')
    console.log(data);
});


var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(geolocate);

map.on('load', function () {
    geolocate.trigger();
});