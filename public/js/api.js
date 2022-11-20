function myFunction () {
  // Get the text field
  const copyText = document.getElementById('api')

  // Select the text field
  copyText.select()
  copyText.setSelectionRange(0, 99999) // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value)
}

// if value valid send to mongo subscribe collection
$('#api_gen').click(() => {
  console.log('nice')
  $.ajax({
    url: '/api',
    type: 'POST',
    success: function (res) {
      console.log(res)
      if (res.generated == '404') {
        $('#api').val('Somethings wrong')
      } else {
        $('#api').val(res.apikey)
        $('#api_gen').prop('disabled', true)
      }
    }
  })
})
