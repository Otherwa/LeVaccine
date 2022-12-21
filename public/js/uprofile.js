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

var flag = 0;
var marker = null;
// when a geolocate event occurs.
geolocate.on('geolocate', function (data) {
    // console.log('A geolocate event has occurred.')
    // get option
    // console.log(data);
    var lng = data.coords.longitude;
    var lat = data.coords.latitude;

    $('#lat').val(lat)
    $('#lon').val(lng)

    // only one marker as per
    if (flag == 0) {
        marker = new maplibregl.Marker({
            draggable: true,
            anchor: 'center'
        }).setLngLat([lng, lat]).addTo(map);
    }
    flag = 0 + 1;

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
                $('#loc').html('Bread 👍')
            })
            .catch(error => console.log('error', error));
    }

    marker.on('dragend', onDragEnd);
});

// controls
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(geolocate);

map.on('load', function () {
    geolocate.trigger();
});
