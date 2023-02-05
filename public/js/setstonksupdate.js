// deletestonks
$('#set').click(function (event) {
    var button = event.target;
    var stock = button.name
    var token = $('#_csrf').val()
    console.log(stock)
    if ($('#vacname').val() != '' && $('#vaccode').val() != '' && $('#des').val() != '' && $('#effec').val() != '' && $('stonk').val() != '' && $('#agai').val() != '') {
        $.confirm({
            title: 'Confirm!',
            theme: 'my-theme',
            content: 'Are You Sure You Want To Update ?',
            boxWidth: '30%',
            useBootstrap: false,
            buttons: {
                confirm: {
                    btnClass: 'btn-red',
                    action: function () {
                        $.ajax({
                            url: '/account/producer/dash/setstonks/update',
                            type: 'PUT',
                            data: {
                                '_csrf': token,
                                '_id': stock,
                                'vaccine': $('#vacname').val(),
                                'vaccinecode': $('#vaccode').val(),
                                'description': $('#des').val(),
                                'effectiveness': $('#effec').val(),
                                'stocks': $('#stonk').val(),
                                'against': $('#agai').val(),
                            },
                            success: function (res) {
                                console.log(res)
                                $('#vacname').val(res.vaccine)
                                $('#vaccode').val(res.vaccinecode)
                                $('#des').val(res.description)
                                $('#effec').val(res.effectiveness)
                                $('#stock').val(res.stocks)
                                $('#agai').val(res.against)
                                $.alert({
                                    theme: 'my-theme',
                                    title: 'Alert!',
                                    content: 'Stock Updated!',
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    buttons: {
                                        Ok: {
                                            btnClass: 'btn-blue',
                                            action: function () {
                                                console.log('ok')
                                            }
                                        }
                                    }
                                });
                            }
                        })

                    }
                },
                cancel: {
                    btnClass: 'btn-blue',
                    action: function () {

                    }
                }
            }
        })
    } else {
        $.alert({
            theme: 'my-theme',
            btnClass: 'btn-red',
            title: 'Alert!',
            content: 'Check All Fields!',
            boxWidth: '30%',
            useBootstrap: false,
            buttons: {
                Ok: {
                    btnClass: 'btn-red',
                    action: function () {
                        console.log('ok')
                    }
                }
            }
        });
    }
});