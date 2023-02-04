$('#set').on('click', (e) => {
    // data context uploaded
    if ($('#vacname').val() != '' && $('#vaccode').val() != '' && $('#des').val() != '' && $('#effec').val() != '' && $('stonk').val() != '' && $('#agai').val() != '') {
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
                    <div style="background-color:red;padding:1rem;margin:1rem">
                        <p>Vaccine Name : ` + item.vaccine + `</p>
                        <p>Vaccine Code : ` + item.vaccinecode + `</p>
                        <p>Description : ` + item.description + `</p>
                        <p>Effectiveness : ` + item.effectiveness + `</p>
                        <p>Stocks : ` + item.stocks + `</p>
                        <p>Against : ` + item.against + `</p>
                    </div>
                `);
                }
                stock.forEach((item) => {
                    $("#stockfields").append(item).show();
                })
            }
        })
    } else {
        $('#msg').html('Check all Fields').show()
        setTimeout(() => {
            $('#msg').html('Check all Fields').hide()
        }, 2000)
    }
})

