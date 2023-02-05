$('#set').on('click', (e) => {
    // data context uploaded
    if ($('#vacname').val() != '' && $('#vaccode').val() != '' && $('#des').val() != '' && $('#effec').val() != '' && $('stonk').val() != '' && $('#agai').val() != '') {
        $.confirm({
            title: 'Confirm!',
            theme: 'my-theme',
            content: 'Are You Sure You Want To Insert ?',
            boxWidth: '30%',
            useBootstrap: false,
            buttons: {
                confirm: {
                    btnClass: 'btn-blue',
                    action: function () {
                        $.ajax({
                            url: '/account/producer/dash/setstonks/set',
                            type: 'POST',
                            data: {
                                '_csrf': $('#_csrf').val(),
                                'id': $('#prodid').val(),
                                'vacname': $('#vacname').val(),
                                'vaccode': $('#vaccode').val(),
                                'des': $('#des').val(),
                                'effec': $('#effec').val(),
                                'stonk': $('#stonk').val(),
                                'agai': $('#agai').val()
                            },
                            success: function (res) {
                                $("input[type=text],input[type=number]").val("");
                                console.log(res)
                                $("#stockfields").html('').hide()
                                // response
                                var stock = res.map(stocks);
                                // console.log(pos)
                                function stocks(item) {
                                    return (`
                                <div class="myFont" style="background-color:#eeeeee;margin-bottom:2.5% !important;padding:1rem;margin:1rem;border-radius: 0.5rem;line-height: 1.5rem;">
                                    <p>Vaccine Name : ` + item.vaccine + `</p>
                                    <p>Vaccine Code : ` + item.vaccinecode + `</p>
                                    <p>Description : ` + item.description + `</p>
                                    <p>Effectiveness : ` + item.effectiveness + `</p>
                                    <p>Stocks : ` + item.stocks + `</p>
                                    <p>Against : ` + item.against + `</p>
                                    <div class="updates" style="display:flex;flex-direction:row;gap:1rem">
                                    <a href="./setstonks/`+ item._id + `"style="text-decoration:underline;color: rgb(255, 0, 221);">Update</a>
                                    <button name="`+ item._id + `" id=" ` + item.vaccine + `(` + item.vaccinecode + `)" style = "text-decoration:underline;color: red;" > Delete</button >
                                    </div >
                                </div >
                                        `);
                                }
                                stock.forEach((item) => {
                                    $("#stockfields").prepend(item).show();
                                })

                                $.alert({
                                    theme: 'my-theme',
                                    title: 'Alert!',
                                    content: 'Stock Inserted!',
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
                    btnClass: 'btn-ed',
                    action: function () {
                        console.log('cancel')
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
})




// deletestonks
$('.updates button').click(function (event) {
    var button = event.target;
    var stock = button.name
    var token = $('#_csrf').val()
    console.log(stock)
    console.log(button.id)


    $.confirm({
        title: 'Confirm!',
        theme: 'my-theme',
        content: 'Are You Sure You Want To Delete ' + button.id + " ?",
        boxWidth: '30%',
        useBootstrap: false,
        buttons: {
            confirm: {
                btnClass: 'btn-red',
                action: function () {

                    $.ajax({
                        url: '/account/producer/dash/setstonks/delete',
                        type: 'PUT',
                        data: {
                            '_csrf': token,
                            '_id': stock,
                        },
                        success: function (res) {
                            console.log(res)
                            $('#' + stock).hide()
                            $.alert({
                                theme: 'my-theme',
                                title: 'Alert!',
                                content: 'Deleted.',
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
                    })

                }
            },
            cancel: {
                btnClass: 'btn-blue',
                action: function () {

                }
            }
        }
    });
})

// validations

