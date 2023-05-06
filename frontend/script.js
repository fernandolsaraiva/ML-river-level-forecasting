const endPointList = [
  { name: 'Estação 1', value: 1000958 },
  { name: 'Estação 2', value: 1000958 },
  { name: 'Estação 3', value: 1000958 }
];
let chart = null

const riverSelect = document.getElementById("river-select");
endPointList.forEach(endPoint => {
  const option = document.createElement("option");
  option.value = endPoint.value;
  option.text = endPoint.name;
  riverSelect.appendChild(option);
});

const plotButton = document.getElementById("plot-button");
plotButton.addEventListener("click", () => {
  const selectedEndPoinIndex = riverSelect.selectedIndex;
  const selectedEndPoint = endPointList[selectedEndPoinIndex].value;
  const apiUrl = `http://140.238.182.60:8000/river?station=${selectedEndPoint}`;


function fetchAndPlotData() {

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const riverData = data;

      const chartData = {
        labels: riverData.data.map(([time, waterLevel]) => time),
        datasets: [{
          label: 'Nível da Água',
          data: riverData.data.map(([time, waterLevel]) => waterLevel),
          backgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            const length = ctx.dataset.data.length;
            return index < length / 2 ? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)';
          },
          borderWidth: 10
        }]
      };

      if (chart) {
        chart.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          title: {
            display: true,
            text: riverData.station
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        }
      });

      document.getElementById('chart-title').textContent = `Nível do rio na estação ${riverData.station}`;
    })
    .catch(error => {
      console.error('There was a problem with the API call:', error);
    });
}

const plotButton = document.getElementById("plot-button");
plotButton.addEventListener("click", fetchAndPlotData);


fetchAndPlotData();
})

