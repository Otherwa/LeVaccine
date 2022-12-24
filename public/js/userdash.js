const Data = $('#count').text();


const labels = [
    'Current Month',
];

const data = {
    labels: labels,
    datasets: [{
        label: 'Number of User',
        backgroundColor: 'rgb(255, 99, 132,0.2)',
        borderColor: 'rgb(255, 99, 132)',
        data: [Data],
    }]
};

const config12 = {
    type: 'bar',
    data: data,
    options: {}
};


// build chart
const myChart = new Chart(
    document.getElementById('myChart'),
    config12
);

// map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0e4ffb970b8f4957bd7450e8df3b2a49', // stylesheet location
    center: [74.5, 19], // starting position [lng, lat]
    zoom: 3 // starting zoom
});

// get location
// Initialize the geolocate control.
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

// controls
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(geolocate);

map.on('load', function () {
    geolocate.trigger();
});