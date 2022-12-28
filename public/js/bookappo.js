var appos = $('#appos').val()
appos = appos.split(',')

var appo_pos = [];
for (var i = 0; i < appos.length; i++) {
    var temp = []

    while (temp.length > 0) {
        temp.pop();
    }

    temp.push(appos[i]);
    temp.push(appos[++i]);

    appo_pos.push(temp)

    //clear
}

// appointemnts all registered
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=0e4ffb970b8f4957bd7450e8df3b2a49', // stylesheet location
    center: [74.5, 19], // starting position [lng, lat]
    zoom: 3, // starting zoom
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

// set all apoints where done
for (var i = 0; i < appo_pos.length; i++) {
    // console.log(appo_pos[i])
    var appo_ = appo_pos[i]

    new maplibregl.Marker({
        draggable: false,
        anchor: 'center',
        color: '#DC143C'
    }).setLngLat([appo_[1], appo_[0]]).addTo(map);
}

var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(geolocate);

map.on('load', function () {
    geolocate.trigger();
});