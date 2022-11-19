//validates email on subscribtion 
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};




$('#reset').on('click', () => {
    var email = $('#email').val();
    // console.log(email);
    if (validateEmail(email)) {
        console.log(email);
        $.ajax({
            url: '/account/user/reset/Tatakae',
            type: 'POST',
            data: { email: email },
            success: function (res) {
                // console.log(res)
                $('#status').html("Check Your Mail");

                $('.email').hide();
                $('.otp').show();
                $('#reset').hide();
                $('#verify').show();
                $('#reset').attr('disabled', 'disabled');
            }
        })
    } else {
        $('#status').html("<span style=\"color:red\">Somethings Wrong</span>");
    }
});

var show_pass_reset = false;
$('#password-reset').attr('disabled', 'disabled');
// passchange if otp user matches
$('#verify').on('click', () => {
    var email = $('#email').val();
    var otp = $('#otp').val();
    $.ajax({
        url: '/account/user/reset-password/Tatakae',
        type: 'POST',
        data: { email: email, otp: otp },
        success: function (res) {
            // console.log(res)
            if (res == '200') {
                $('#status').html("<span style=\"color:green\">OTP Verified</span>");
                $('#verify').hide();
                $('.otp').hide();

                $('.pass1').show();
                $('.pass2').show();
                $('#password-reset').show();
                show_pass_reset = true;
            } else {
                $('#status').html("<span style=\"color:red\">Wrong OTP</span>");
            }
        }
    })
})


$("#pass2").on('input', () => {
    // your code
    var data = $('#pass2').val();
    if (data != $('#pass1').val()) {
        console.log("not same")
        $('#password-reset').prop("disabled", true);
        $('#status').html("<span style=\"color:red\">Password Not Same</span>");
    } else {
        console.log("same")
        $('#status').html("<span style=\"color:green\">Bread🍞👍 </span>");
        $('#password-reset').prop("disabled", false);
    }
});

setInterval(() => {
    // console.log(112)
    if (show_pass_reset) {
        $('#password-reset').prop("disabled", false);
    } else {
        $('#password-reset').prop("disabled", true);
        $('.pass1').hide();
        $('.pass2').hide();
    }
}, 1000)


$('#password-reset').click(() => {
    var password = $('#pass2').val()
    var email = $('#email').val()
    var otp = $('#otp').val()
    $.ajax({
        url: '/account/user/reset-password-ok/Tatakae',
        type: 'POST',
        data: { email: email, password: password, otp: otp },
        success: function (res) {
            console.log(res)
            if (res == '200') {
                $('#status').html("<span style=\"color:green\">Password Updated</span>");

                $('#pass1').val('').prop("disabled", true);
                $('#pass2').val('').prop("disabled", true);
                $('#password-reset').prop("disabled", true);
                setTimeout(() => {
                    window.location.replace('/account/user/')
                }, 1500)
            } else {
                $('#status').html("<span style=\"color:red\">Somethings Wrong</span>");
            }
        }
    })
})