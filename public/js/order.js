$(window).on('load', () => {
    let status_get = $("#status_check").val()
    $('#'+status_get).attr('disabled', true);
});

$('input[type="button"]').click(function (event) {
    var button_ = event.target;
    // alert(button.name);
    var status = button_.id
    $.confirm({
        title: 'Confirm!',
        theme: 'my-theme',
        content: 'Are You Sure You Want To Buy?',
        boxWidth: '40vw',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                action: function () {
                    let status_final = status;
                    $('#check').attr('disabled', true);
                    let token = $("#_csrf").val();
                    let id = $("#statuss").val();
                    var real_status = null;
                    if (status_final == "Dispacted") {
                        real_status = "Dispacted"
                    }
                    else if (status_final == "Processing") {
                        real_status = "Processing"
                    } else if (status_final == "Transit") {
                        real_status = "Transit"
                    }
                    else if (status_final == "Delete") {
                        $.ajax({
                            url: '/account/producer/dash/orders/delete',
                            type: 'PUT',
                            data: {
                                '_csrf': token,
                                'id': id,
                            },
                            success: function (res) {
                                console.log("success")
                                console.log(res)
                                // $("#status").html(real_status)
                                window.location.replace('/account/producer/dash/orders');
                            }
                        })
                    } else {
                        real_status = "Completed"
                    }
                    console.log("buying")
                    $.ajax({
                        url: '/account/producer/dash/orders/update',
                        type: 'PUT',
                        data: {
                            '_csrf': token,
                            'id': id,
                            'status': real_status
                        },
                        success: function (res) {
                            console.log("success")
                            console.log(res)
                            $("#status").html(real_status)
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