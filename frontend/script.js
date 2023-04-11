const rivers = [
  { name: "Estação 1", data: [5, 3, 5, 7, 8, 6, 4, 3, 5, 8, 5, 6, 5, 4, 5, 7, 8, 6, 4, 3, 4, 8, 5, 6] },
  { name: "Estação 2", data: [2, 4, 5, 7, 8, 6, 4, 5, 6, 8, 5, 6, 8, 7, 5, 7, 8, 7, 4, 3, 5, 8, 5, 6] },
  { name: "Estação 3", data: [5, 3, 5, 7, 8, 5, 4, 3, 5, 5, 5, 6, 5, 7, 5, 7, 8, 6, 4, 6, 8, 8, 5, 6] }
];

// Populate the river select picklist
const riverSelect = document.getElementById("river-select");
rivers.forEach((river) => {
  const option = document.createElement("option");
  option.value = river.name;
  option.text = river.name;
  riverSelect.appendChild(option);
});

// Plot the chart when the button is clicked
const plotButton = document.getElementById("plot-button");
plotButton.addEventListener("click", () => {
  const selectedRiver = rivers.find((river) => river.name === riverSelect.value);

  const times = Array.from({ length: 240 / 10 }, (_, i) => {
    const time = new Date(Date.UTC(2023, 3, 11, 14, i * 10));
    return time.toISOString().substr(11, 5); // extract hours and minutes
  });

  const maxLevel = Math.max(...selectedRiver.data);
  const blueData = [
    {
      x: times.slice(0, times.length / 2),
      y: selectedRiver.data.slice(0, selectedRiver.data.length / 2),
      type: "scatter",
      mode: "lines",
      name: "Nível do Rio",
      line: { color: "blue" }
    }
  ];
  const redData = [
    {
      x: times.slice(times.length / 2),
      y: selectedRiver.data.slice(selectedRiver.data.length / 2),
      type: "scatter",
      mode: "lines",
      name: "Previsão de Nível (2 horas)",
      line: { color: "red" }
    }
  ];

  const layout = {
    title: `${selectedRiver.name}`,
    xaxis: { title: "Horário (GMT)" },
    yaxis: { title: "Nível do Rio", range: [0, Math.ceil(maxLevel/10) * 10] }
  };

  Plotly.newPlot("chart-container", [blueData[0], redData[0]], layout);
});


/*
const rivers = [];

// Populate the river select picklist
const riverSelect = document.getElementById("river-select");

function updateRivers() {
  fetch('https://example.com/api/rivers')
    .then(response => response.json())
    .then(data => {
      rivers.length = 0; // Clear the array before updating
      data.forEach(river => rivers.push(river));

      // Update the options in the select picklist
      riverSelect.innerHTML = '';
      rivers.forEach(river => {
        const option = document.createElement("option");
        option.value = river.name;
        option.text = river.name;
        riverSelect.appendChild(option);
      });
    })
    .catch(error => console.error(error));
}

updateRivers(); // Call the function once to populate the picklist initially

// Plot the chart when the button is clicked
const plotButton = document.getElementById("plot-button");
plotButton.addEventListener("click", () => {
  const selectedRiver = rivers.find((river) => river.name === riverSelect.value);

  const times = Array.from({ length: 240 / 10 }, (_, i) => {
    const time = new Date(Date.UTC(2023, 3, 11, 14, i * 10));
    return time.toISOString().substr(11, 5); // extract hours and minutes
  });

  const maxLevel = Math.max(...selectedRiver.data);
  const blueData = [
    {
      x: times.slice(0, times.length / 2),
      y: selectedRiver.data.slice(0, selectedRiver.data.length / 2),
      type: "scatter",
      mode: "lines",
      name: "Nível do Rio",
      line: { color: "blue" }
    }
  ];
  const redData = [
    {
      x: times.slice(times.length / 2),
      y: selectedRiver.data.slice(selectedRiver.data.length / 2),
      type: "scatter",
      mode: "lines",
      name: "Previsão de Nível (2 horas)",
      line: { color: "red" }
    }
  ];

  const layout = {
    title: `${selectedRiver.name}`,
    xaxis: { title: "Horário (GMT)" },
    yaxis: { title: "Nível do Rio", range: [0, Math.ceil(maxLevel/10) * 10] }
  };

  Plotly.newPlot("chart-container", [blueData[0], redData[0]], layout);
});
*/