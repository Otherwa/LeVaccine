var appos = $('#appo_pos').val()
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

// ajax stop appointments
$("#stop_appo").bind('click', () => {
    console.log("click")

    let token = $("#_csrf").val();
    let appo_id = $("#appo_id").val();
    console.log("csrf token: " + token)

    $.confirm({
        title: 'Confirm!',
        theme: 'my-theme',
        content: 'Are You Sure You Want Stop Appointments ?',
        boxWidth: '40vw',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: '/account/provider/dash/appos/' + appo_id,
                        type: 'POST',
                        data: {
                            '_csrf': token,
                            'appo_id': appo_id
                        },
                        success: function (res) {

                            console.log("success")
                            $("#flag").html("Completed").css('color', 'green')
                            $("#stop_appo").prop('disabled', true)
                            $("#start_appo").prop('disabled', false)
                        }
                    })

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



})


// ajax start appointments
$("#start_appo").bind('click', () => {
    console.log("click")

    let token = $("#_csrf").val();
    let appo_id = $("#appo_id").val();
    console.log("csrf token: " + token)

    $.confirm({
        title: 'Confirm!',
        content: 'Are You Sure You Want Start Appointments ?',
        boxWidth: '40vw',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: '/account/provider/dash/appos/' + appo_id,
                        type: 'PUT',
                        data: {
                            '_csrf': token,
                            'appo_id': appo_id
                        },
                        success: function (res) {
                            console.log("success")
                            $("#flag").html("On-going").css('color', 'rgb(227, 78, 217)')
                            $("#stop_appo").prop('disabled', false)
                            $("#start_appo").prop('disabled', true)
                        }
                    })

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
})


// update
function update() {

    let token = $("#_csrf").val();
    let appo_id = $("#appo_id").val();
    $.ajax({
        url: '/account/provider/dash/appos/' + appo_id,
        type: 'POST',
        data: {
            '_csrf': token,
            'appo_id': appo_id
        },
        success: function (res) {
            console.log("success")
            $("#flag").html("Completed As Day Was Over").css('color', 'green')
        }
    })
}

// check if appointemnt stopped or not
$(window).on('load', function () {
    // Run code
    console.log($('#appo_status').val())
    console.log($('#appo_date').val())
    if (new Date($('#appo_date').val()) < new Date()) {
        console.log('yes')
        $("#stop_appo").prop('disabled', true)
        $("#start_appo").prop('disabled', true)
        update()
    }
});

if ($('#appo_status').val() === 'true') {
    $("#start_appo").prop('disabled', false)
    $("#stop_appo").prop('disabled', true)
    // $('#stop_appo').css('pointer-events', 'none');
} else {
    // $('#start_appo').css('pointer-events', 'none');
    $("#stop_appo").prop('disabled', false)
    $("#start_appo").prop('disabled', true)
}

// book appo
// book appo
$('#book-appo').on('click', function () {
    let token = $("#_csrf").val();
    console.log(token)
    let appo_id = $("#id").val();

    $.confirm({
        title: 'Confirm!',
        theme: 'my-theme',
        content: 'Are You Sure You Want Book An Appointment ?',
        boxWidth: '40vw',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: '/account/user/dash/bookappo/' + appo_id,
                        type: 'POST',
                        data: {
                            '_csrf': token,
                            'appo_id': appo_id
                        },
                        success: function (res) {
                            console.log("success")
                            if (res.status == '200') {
                                $("#status").html("Appointment Booked").css('color', 'purple')
                            } else {
                                $("#status").html("Appointment Was Not Booked").css('color', 'red')
                            }
                        },
                    })
                },
                cancel: {
                    btnClass: 'btn-red',
                    action: function () {
                        console.log('canceld')
                    }
                }
            }
        }
    })
})