var map = L.map('map').setView([-23.589799, -46.588237], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let popupContent1 = "Rio Tamanduatei - 143<br \\><button id='map_button' onclick=\"fetchAndPlotData_station('143')\">Ver Graficos</button>"
let popupContent2 = "Rio Tamanduatei - 1000958<br \\><button id='map_button' onclick=\"fetchAndPlotData_station('1000958')\">Ver Graficos</button>"
let popupContent3 = "Rio Tamanduatei - 413<br \\><button id='map_button' onclick=\"fetchAndPlotData_station(413)\">Ver Graficos</button>"

L.marker([-23.61085, -46.544628]).addTo(map).bindPopup(popupContent1);
L.marker([-23.589799, -46.588237]).addTo(map).bindPopup(popupContent2);
L.marker([-23.541539, -46.628423]).addTo(map).bindPopup(popupContent3);

