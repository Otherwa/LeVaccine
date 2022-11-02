// chart json

var data = [0, 0];
var dates = ['2022-10-31', '2022-10-30', '2022-10-29', '2022-10-28', '2022-10-27', '2022-10-26', '2022-10-25', '2022-10-24', '2022-10-23', '2022-10-22', '2022-10-21', '2022-10-20', '2022-10-19', '2022-10-18', '2022-10-17', '2022-10-16', '2022-10-15', '2022-10-14', '2022-10-13', '2022-10-12', '2022-10-11', '2022-10-10', '2022-10-09', '2022-10-08', '2022-10-07', '2022-10-06', '2022-10-05', '2022-10-04', '2022-10-03', '2022-10-02', '2022-10-01', '2022-09-30', '2022-09-29', '2022-09-28', '2022-09-27', '2022-09-26', '2022-09-25', '2022-09-24', '2022-09-23', '2022-09-22', '2022-09-21', '2022-09-20', '2022-09-19', '2022-09-18', '2022-09-17', '2022-09-16', '2022-09-15', '2022-09-14', '2022-09-13', '2022-09-12', '2022-09-11', '2022-09-10', '2022-09-09', '2022-09-08', '2022-09-07', '2022-09-06', '2022-09-05', '2022-09-04', '2022-09-03', '2022-09-02', '2022-09-01', '2022-08-31', '2022-08-30', '2022-08-29', '2022-08-28', '2022-08-27', '2022-08-26', '2022-08-25', '2022-08-24', '2022-08-23', '2022-08-22', '2022-08-21', '2022-08-20', '2022-08-19', '2022-08-18', '2022-08-17', '2022-08-16', '2022-08-15', '2022-08-14', '2022-08-13', '2022-08-12', '2022-08-11', '2022-08-10', '2022-08-09', '2022-08-08', '2022-08-07', '2022-08-06', '2022-08-05', '2022-08-04', '2022-08-03', '2022-08-02', '2022-08-01', '2022-07-31', '2022-07-30', '2022-07-29', '2022-07-28', '2022-07-27', '2022-07-26', '2022-07-25', '2022-07-24'];
// chart js
const datas = {
    labels: dates,
    datasets: [{
        label: 'Past history data',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: data,
    }]
};

// chart.js
const myChart = new Chart(
    document.getElementById('myChart'),
    {
        type: 'bar',
        data: datas,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
        }
    }
);

$(window).on("load", function () {
    var option = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };
    // get countryies
    fetch('https://covid-193.p.rapidapi.com/countries', option)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            response = response.response
            $.each(response, function (key, value) {


                // console.log(value);
                $('#scountry').append($("<option></option>")
                    .attr("value", value)
                    .text(value));
            });
        })
        .catch(err => console.error(err));
});

//get relevant latest data
$('#scountry').change(() => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    const country = $('#scountry').val().toLowerCase().trim();
    const str = 'https://covid-193.p.rapidapi.com/statistics?country=' + country;
    // console.log(str);
    fetch(str, options)
        .then(response => response.json())
        .then((response) => {
            // console.log(response)
            var data = response.response[0];

            $('#continent').text(" " + data.continent + " ");
            $('#country').text(" " + data.country + " ");
            $('#population').text(" " + data.population + " ");
            $('#new').text(" " + data.cases.new + " ");
            $('#active').text(" " + data.cases.active + " ");
            $('#critical').text(" " + data.cases.critical + " ");
            $('#recovered').text(" " + data.cases.recovered + " ");
            $('#1M_Pop').text(" " + data.cases['1_MPop'] + " ");
            $('#total').text(" " + data.cases.total + " ");
            $('#day').text(" " + data.day + " ");
            $('#time').text(" " + data.time + " ");
            $('#stat').text('status 202 GET').css('color', 'green');
        })
        .catch((err) => {
            $('#stat').text('status 404').css('color', 'red');
            console.log(err)
        });


    // get history of specific Country
    const options1 = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f54bde0a4bmshd39e1d1110c4cd5p17ab10jsn0b920baf5821',
            'X-RapidAPI-Host': 'covid-19-by-api-ninjas.p.rapidapi.com'
        }
    };
    const str2 = 'https://covid-19-by-api-ninjas.p.rapidapi.com/v1/covid19?country=' + country;
    // 
    console.log(str2)
    fetch(str2, options1)
        .then(response => response.json())
        .then(response => {
            while (data.length > 0) {
                data.pop();
            }
            while (dates.length > 0) {
                dates.pop();
            }

            console.log(response)
            response = response[0].cases

            $.each(response, function (key, value) {
                dates.push(key);
                data.push(value.new);
            });

            // dates.splice(0, 930);
            // data.splice(0, 930);

            dates.reverse();
            data.reverse();

            myChart.update();
            $('#countrytxt').text(country);
        })
        .catch(err => $('#countrytxt').text("Not Available"));

    // build chart
});








