let chart = null;
let jsonData = null;
let downloadDataButton = null;
let downloadAIParametersButton = null;

function fetchAndPlotData_station(station) {
  const apiUrl = `http://140.238.182.60:8000/river?station=${station}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      jsonData = data;
      const riverData = data;

      const chartData = {
        labels: riverData.data.map(([time, waterLevel]) => convertUTCToBRT(time)),
        datasets: [{
          label: 'Nível da águal em metros acima do nível do mar. Dados reais em azul x dados previstos para as próximas duas horas em vermelho.',
          data: riverData.data.map(([time, waterLevel]) => waterLevel),
          backgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            const length = ctx.dataset.data.length;
            return index < length / 2 ? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)';
          },
          borderWidth: 10
        }]
      };

      if (!chart) {
        const ctx = document.getElementById('myChart').getContext('2d');
        chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            title: {
              display: true,
              text: riverData.station
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      } else {
        chart.data = chartData;
        chart.update();
      }

      document.getElementById('chart-title').textContent = `Nível do rio na estação ${riverData.station}`;

      if (downloadDataButton) {
        downloadDataButton.removeEventListener('click', downloadData);
      }
      downloadDataButton = document.getElementById('download-data-button');
      downloadDataButton.addEventListener('click', downloadData);

      if (downloadAIParametersButton) {
        downloadAIParametersButton.removeEventListener('click', downloadData);
      }
      downloadAIParametersButton = document.getElementById('download-parameters-button');
      downloadAIParametersButton.addEventListener('click', downloadData);

    })
    .catch(error => {
      console.error('There was a problem with the API call:', error);
    });
}

function convertUTCToBRT(time) {
  const [hours, minutes] = time.split(':');
  const utcHours = parseInt(hours, 10);
  const utcMinutes = parseInt(minutes, 10);
  const brtHours = (utcHours - 3 + 24) % 24;
  const brtMinutes = utcMinutes;
  const brtTime = `${brtHours.toString().padStart(2, '0')}:${brtMinutes.toString().padStart(2, '0')}h`;
  return brtTime;
}

function downloadData() {
  downloadCSV(jsonData);
}

function downloadCSV(jsonData) {
  const csvContent = convertToCSV(jsonData);
  const encodedURI = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
  const link = document.createElement('a');
  link.setAttribute('href', encodedURI);
  link.setAttribute('download', `Station_${jsonData.station}_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(jsonData) {
  let csvContent = '';
  const headers = Object.keys(jsonData);
  csvContent += headers.join(',') + '\n';
  for (const header of headers) {
    const value = jsonData[header];
    if (Array.isArray(value)) {
      const row = value.map(item => JSON.stringify(item)).join(',');
      csvContent += row + '\n';
    } else {
      const row = JSON.stringify(value);
      csvContent += row + '\n';
    }
  }
  return csvContent;
}
