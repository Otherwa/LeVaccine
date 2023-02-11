$('#stock').on('input', () => {
    var max_stock = $('#max_stock').val()
    var stock = $('#stock').val()
    console.log(stock + "<" + max_stock)
    if (stock <= 0 || stock >= (Number(max_stock) + 1)) {
        $('#buy').prop('disabled', true)
    } else {
        $('#buy').prop('disabled', false)
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
                    let vaccode = $("#vaccode").val();
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
                            'vaccinecode': vaccode,
                            'stock': stock,
                            'email': email
                        },
                        success: function (res) {
                            console.log("success")
                            window.location.replace('/account/provider/dash/orders');
                            $("#flag").html(count - stock)
                            $("#stock").val(1)
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