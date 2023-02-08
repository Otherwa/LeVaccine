$('#stock').on('input', () => {
    var stock = $('#stock').val()
    if (stock > 0) {
        $('#buy').prop('disabled', false)
    } else {
        $('#buy').prop('disabled', true)
    }
})

//
// ajax to buy vaccines

$('#buy').on('click', () => {
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
                    $('#check').attr('disabled', true);
                    let token = $("#_csrf").val();
                    let proid = $("#proid").val();
                    let stonkid = $("#stonkid").val();
                    let prodid = $("#prodid").val();
                    let stock = $("#stock").val();
                    let email = $("#email").val();
                    var count = $('#flag').html()
                    $("#flag").html("Buying")
                    console.log("buying")
                    $.ajax({
                        url: '/account/provider/dash/buyvaccines/buy',
                        type: 'PUT',
                        data: {
                            '_csrf': token,
                            'prodid': prodid,
                            'proid': proid,
                            'stonkid': stonkid,
                            'stock': stock,
                            'email': email
                        },
                        success: function (res) {
                            console.log("success")
                            $("#flag").html(count - stock)
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