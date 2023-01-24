$('#help').click(() => {
    let req = $("#prompt").val();
    $("#prompt").val('');

    $('#progress').html('<p class=\"myFont\">Querying....</p>')

    $.ajax({
        url: '/help',
        type: 'POST',
        data: { prompt: req, _csrf: $('#_csrf').val() },
        success: function (res) {

            // random background
            var x = Math.floor(Math.random() * 256);
            var y = Math.floor(Math.random() * 256);
            var z = Math.floor(Math.random() * 256);
            var bgColor = "rgb(" + x + "," + y + "," + z + ")";
            // console.log(res)
            // console.log(res)
            let data = "<div class=\"inres\" style=\"display:none;background-color:" + bgColor + "\"><code>" + res.message + "</code></div>";
            $('.res').prepend(data)
            $('.inres').show('slow');
            $('#progress').html('<p class=\"myFont\" style=\"color:green\">Facts..</p>')
        }
    })
});