// validates email on subscribtion
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

// set pass to disabled
$('#pass1').prop('disabled', true)
$('#pass2').prop('disabled', true)

// if click and data retieved sucess then disable
$('#reset').on('click', () => {
  const email = $('#email').val()
  // console.log(email);
  if (validateEmail(email)) {
    document.cookie = 'Status=Reset'
    console.log(email)
    $.ajax({
      url: '/account/user/reset',
      type: 'POST',
      data: { email },
      success: function (res) {
        // console.log(res)
        if (res == '200') {
          $('#status').html('Check Your Mail')
          $('.email').hide()
          $('.otp').show()
          $('#reset').hide()
          $('#verify').show()
          $('#reset').attr('disabled', 'disabled')
        } else {
          $('#status').html('<span style="color:red">Somethings Wrong</span>')
        }
      }
    })
  } else {
    $('#status').html('<span style="color:red">Somethings Wrong</span>')
  }
})

let show_pass_reset = false
$('#password-reset').attr('disabled', 'disabled')
// passchange if otp user matches
$('#verify').on('click', () => {
  const email = $('#email').val()
  const otp = $('#otp').val()
  $.ajax({
    url: '/account/user/reset-password',
    type: 'POST',
    data: { email, otp },
    success: function (res) {
      // console.log(res)
      if (res == '200') {
        $('#status').html('<span style="color:green">OTP Verified</span>')
        $('#verify').hide()
        $('.otp').hide()

        $('.pass1').show()
        $('.pass2').show()
        $('#pass1').prop('disabled', false)
        $('#pass2').prop('disabled', false)
        $('#password-reset').show()
        show_pass_reset = true
      } else {
        $('#status').html('<span style="color:red">Wrong OTP</span>')
      }
    }
  })
})

// checks if "" if empty or lenght should be greater than 7
$('#pass1').on('input', () => {
  if (
    $('#pass2').val() != $('#pass1').val() ||
    $('#pass1').val() == '' ||
    $('#pass2').val() == ''
  ) {
    $('#password-reset').prop('disabled', true)
    if ($('#pass2').val().length < 7 || $('#pass1').val().length < 7) {
      $('#status').html('<span style="color:red">Password Too Short</span>')
    } else {
      $('#status').html('<span style="color:red">Password Not Same</span>')
    }
  } else {
    console.log('same')
    $('#status').html('<span style="color:green">Bread🍞👍 </span>')
    $('#password-reset').prop('disabled', false)
  }
})

$('#pass2').on('input', () => {
  const data = $('#pass2').val()
  if (data != $('#pass1').val() || data == '' || $('#pass2').val() == '') {
    $('#password-reset').prop('disabled', true)
    if ($('#pass2').val().length < 7 || $('#pass1').val().length < 7) {
      $('#status').html('<span style="color:red">Password Too Short</span>')
    } else {
      $('#status').html('<span style="color:red">Password Not Same</span>')
    }
  } else {
    console.log('same')
    $('#status').html('<span style="color:green">Bread🍞👍 </span>')
    $('#password-reset').prop('disabled', false)
  }
})

// boolean
setInterval(() => {
  if (!show_pass_reset) {
    $('#password-reset').prop('disabled', true)
    $('.pass1').hide()
    $('.pass2').hide()
  }
}, 1000)

// after sucessful redirect
$('#password-reset').click(() => {
  const password = $('#pass2').val()
  const email = $('#email').val()
  const otp = $('#otp').val()
  $.ajax({
    url: '/account/user/reset-password-ok',
    type: 'POST',
    data: { email, password, otp },
    success: function (res) {
      console.log(res)
      if (res == '200') {
        $('#status').html('<span style="color:green">Password Updated</span>')

        $('#pass1').val('').prop('disabled', true)
        $('#pass2').val('').prop('disabled', true)
        $('#password-reset').prop('disabled', true)
        setTimeout(() => {
          window.location.replace('/account/user')
        }, 500)
      } else {
        $('#status').html('<span style="color:red">Somethings Wrong</span>')
      }
    }
  })
})
