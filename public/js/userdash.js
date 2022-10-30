const Data = $('#count').text();


const labels = [
    'Current Month',
];

const data = {
    labels: labels,
    datasets: [{
        label: 'Number of User',
        backgroundColor: 'rgb(255, 99, 132,0.2)',
        borderColor: 'rgb(255, 99, 132)',
        data: [Data],
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {}
};


// build chart
const myChart = new Chart(
    document.getElementById('myChart'),
    config
);
