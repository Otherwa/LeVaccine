var people = $('#people').val()
appos = people.split(',')

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

if (appo_pos[0][1] != undefined) {
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
}

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

$('input[type="button"]').click(function (event) {
    var button = event.target;
    // alert(button.name);
    var person = button.name
    console.log(person)

    // inverse
    var id = button.id
    var buttonid = '#' + id
    $(buttonid).attr('disabled', true);
    setTimeout(() => { $(buttonid).attr('disabled', false); }, 2000)


    flag_id = id.split('_')
    console.log(flag_id)

    let token = $("#_csrf").val();


    $.confirm({
        title: 'Confirm!',
        content: 'Are You Sure You Want Change Authorization ?',
        boxWidth: '30%',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                action: function () {

                    if (button.value == 'Authorize') {
                        $.ajax({
                            url: '/account/producer/dash/authorize/authprovider',
                            type: 'PUT',
                            data: {
                                '_csrf': token,
                                'user': person,
                            },
                            success: function (res) {
                                console.log(res)
                                $("#flag" + flag_id[1]).html("Authorzied").css('color', 'green')
                            }
                        })
                    } else {
                        $.ajax({
                            url: '/account/producer/dash/authorize/unauthprovider',
                            type: 'PUT',
                            data: {
                                '_csrf': token,
                                'user': person,
                            },
                            success: function (res) {
                                console.log(res)
                                $("#flag" + flag_id[1]).html("Not Authorzied").css('color', 'red')
                            }
                        })
                    }


                }
            },
            cancel: {
                btnClass: 'btn-red',
                action: function () {
                    console.log('canceld')
                }
            }
        }
    });
});