function myFunction() {
    // Get the text field
    var copyText = document.getElementById("api");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}

// if value valid send to mongo subscribe collection
$('#signup').click(() => {
    console.log('nice');

    var token = $('#csrf').val()
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            '_csrf': token
        },
        success: function (res) {
            console.log(res)
            if (res.generated == "404") {
                $('#api').val('Somethings wrong')
            } else {
                $('#api').val(res.apikey)
                $('#signup').prop('disabled', true);
            }
        }
    })
});

$('#back').click(() => {
    window.history.back()
})