// chart json

const data = []
const dates = []

const options1 = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
    'X-RapidAPI-Host': 'covid-19-by-api-ninjas.p.rapidapi.com'
  }
}
const str2 =
  'https://covid-19-by-api-ninjas.p.rapidapi.com/v1/covid19?country=india'
$('#countrytxt').text('Loading...')
fetch(str2, options1)
  .then((response) => response.json())
  .then((response) => {
    while (data.length > 0) {
      data.pop()
    }
    while (dates.length > 0) {
      dates.pop()
    }

    // console.log(response)
    response = response[0].cases

    $.each(response, function (key, value) {
      key = new Date(key).toDateString()
      key = key.split(' ')
      key = key[2] + '-' + key[1] + '-' + key[3]
      // format
      dates.push(key)
      data.push(value.new)
    })

    dates.reverse()
    data.reverse()

    myChart.update()
    $('#countrytxt').text('india')
  })
  .catch((err) => {
    $('#countrytxt').text('Not Available')
  })

const datas = {
  labels: dates,
  datasets: [
    {
      label: 'Past history of infection',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data
    }
  ]
}

// chart.js
const myChart = new Chart(document.getElementById('myChart'), {
  type: 'bar',
  data: datas,
  options: {
    pointRadius: 0,
    pointHitRadius: 0,
    boderWidth: 1,
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'No.of Infected people'
        },
        min: 0,
        ticks: {
          // forces step size to be 50 units
          stepSize: 50000
        }
      }
    }
  }
})

// get countires
$(window).on('load', function () {
  const option = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
      'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
  }
  // get countryies
  fetch('https://covid-193.p.rapidapi.com/countries', option)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      response = response.response
      $.each(response, function (key, value) {
        // console.log(value);
        $('#scountry').append(
          $('<option></option>').attr('value', value).text(value)
        )
      })
    })
    .catch((err) => console.error(err))
})

// get relevant latest data
$('#scountry').change(() => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
      'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
  }

  const country = $('#scountry').val().toLowerCase().trim()
  const str = 'https://covid-193.p.rapidapi.com/statistics?country=' + country
  // console.log(str);
  fetch(str, options)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      const data = response.response[0]

      $('#continent').text(' ' + data.continent + ' ')
      $('#country').text(' ' + data.country + ' ')
      $('#population').text(' ' + data.population + ' ')
      $('#new').text(' ' + data.cases.new + ' ')
      $('#active').text(' ' + data.cases.active + ' ')
      $('#critical').text(' ' + data.cases.critical + ' ')
      $('#recovered').text(' ' + data.cases.recovered + ' ')
      $('#1M_Pop').text(' ' + data.cases['1_MPop'] + ' ')
      $('#total').text(' ' + data.cases.total + ' ')
      $('#day').text(' ' + data.day + ' ')
      // format
      let date = new Date(data.time)
      date = date.toUTCString()
      $('#time').text(' ' + date + ' ')
      $('#stat').text('status 202 GET').css('color', 'green')
    })
    .catch((err) => {
      $('#stat').text('status 404').css('color', 'red')
      // console.log(err);
    })

  // get history of specific Country
  const options1 = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
      'X-RapidAPI-Host': 'covid-19-by-api-ninjas.p.rapidapi.com'
    }
  }
  const str2 =
    'https://covid-19-by-api-ninjas.p.rapidapi.com/v1/covid19?country=' +
    country
  //
  // console.log(str2)
  fetch(str2, options1)
    .then((response) => response.json())
    .then((response) => {
      while (data.length > 0) {
        data.pop()
      }
      while (dates.length > 0) {
        dates.pop()
      }

      // console.log(response)
      response = response[0].cases

      $.each(response, function (key, value) {
        key = new Date(key).toDateString()
        key = key.split(' ')
        key = key[2] + '-' + key[1] + '-' + key[3]
        // format
        dates.push(key)
        data.push(value.new)
      })

      dates.reverse()
      data.reverse()

      myChart.update()
      $('#countrytxt').text(country)
    })
    .catch((err) => {
      $('#countrytxt').text('Not Available')
      while (data.length > 0) {
        data.pop()
      }
      while (dates.length > 0) {
        dates.pop()
      }
      myChart.update()
    })

  // build chart
})
