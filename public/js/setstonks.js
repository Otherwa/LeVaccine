$('#set').on('click', (e) => {

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
                $("#stockfields").html(JSON.stringify(res)).show()
            }
        })
    } else {
        $('#msg').html('Check all Fields').show()
        setTimeout(() => {
            $('#msg').html('Check all Fields').hide()
        }, 2000)
    }
})

