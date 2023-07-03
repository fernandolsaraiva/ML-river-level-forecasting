let chart = null;
let jsonData = null;
let downloadDataButton = null;
let downloadAIParametersButton = null;
let aiUrl = null;
let aiParameterName = null;

function fetchAndPlotData_station(station) {
  const apiUrl = `http://140.238.182.60:8000/river?station=${station}`;
  aiUrl = `http://140.238.182.60:8000/model?station=${station}`;
  aiParameterName = `random_forest_${station}.joblib`;

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
        downloadAIParametersButton.removeEventListener('click', downloadAIData);
      }
      downloadAIParametersButton = document.getElementById('download-parameters-button');
      downloadAIParametersButton.addEventListener('click', downloadAIData);

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

function downloadAIData() {
  downloadFile(aiUrl, aiParameterName)
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
  const firstItem = jsonData[headers[0]];

  if (Array.isArray(firstItem)) {
    csvContent += 'time,river level\n';
    const rows = firstItem.map(item => `${item[0]},${removeDecimals(item[1])}`);
    csvContent += rows.join('\n') + '\n';
  }

  const remainingHeaders = headers.slice(1);
  if (remainingHeaders.length >= 2) {
    csvContent += 'Station,UTC\n';
    const stationValue = jsonData[remainingHeaders[0]];
    const utcValue = jsonData[remainingHeaders[1]];
    const stationRow = Array.isArray(stationValue) ? stationValue.join(',') : JSON.stringify(stationValue);
    const utcRow = Array.isArray(utcValue) ? utcValue.join(',') : JSON.stringify(utcValue);
    csvContent += `${stationRow},${utcRow}\n`;
  } else {
    for (const header of remainingHeaders) {
      const value = jsonData[header];
      if (Array.isArray(value)) {
        const rows = value.map(item => `${item[0]},${removeDecimals(item[1])}`);
        csvContent += rows.join('\n') + '\n';
      } else {
        const row = JSON.stringify(value);
        csvContent += row + '\n';
      }
    }
  }
  return csvContent;
}

function removeDecimals(value) {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  return value;
}

function downloadFile(aiUrl, aiParameterName) {
  fetch(aiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const a = document.createElement('a');
      const objectURL = URL.createObjectURL(blob);
      
      a.href = objectURL;
      a.download = aiParameterName || 'download';
      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(objectURL);
        a.remove();
      }, 0);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
