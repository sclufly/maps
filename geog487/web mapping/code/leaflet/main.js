// initialize the map
var map = L.map('map').setView([49.527987, -113.280431], 9);

// add base layer
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 9
});

positron.addTo(map);

// add north arrow
var northArrow = L.control({ position: 'topleft' });

northArrow.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'north-arrow');
    div.innerHTML = '<div class="north-arrow-inner">↑<br><span>N</span></div>';
    return div;
};

northArrow.addTo(map);

// add scale bar
L.control.scale({
    position: 'topleft',
    imperial: true,
    metric: true
}).addTo(map);

// add legend
var legend = L.control({ position: 'topright' });

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Legend</h4>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#0066cc;fill-opacity:0.5;stroke:#0066cc;stroke-width:2"/></svg> Lakes and Rivers</div>';
    div.innerHTML += '<div><svg width="20" height="20"><line x1="0" y1="10" x2="20" y2="10" style="stroke:#000000;stroke-width:4"/></svg> Lethbridge City Boundary</div>';
    return div;
};

legend.addTo(map);

// add layer selector
var layerSelector = L.control({ position: 'topright' });

layerSelector.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'layer-selector-control');
    div.innerHTML = '<label for="layerSelect">Climate Change Factor</label>' +
                    '<select id="layerSelect" onchange="updateClimateLayer()">' +
                    '<option value="drought">Drought Monitor</option>' +
                    '<option value="precipitation" selected>Precipitation</option>' +
                    '<option value="temperature">Temperature</option>' +
                    '</select>';
    
    // Prevent map interactions when interacting with the selector
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    
    return div;
};

layerSelector.addTo(map);

// add basic layer GeoJSONs in order (water first, then boundary)
L.geoJSON(albertaWaterJson, {
    style: {
        color: '#0066cc',
        weight: 2,
        fillOpacity: 0.5
    },
    onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
            if (feature.properties) {
                var popupContent = '<div style="max-height: 200px; overflow-y: auto;">';
                popupContent += '<b>' + (feature.properties.NAME || 'N/A') + '</b><br>';
                popupContent += 'ID: ' + (feature.properties.FEATURE_TY || 'N/A') + '<br>';
                popupContent += 'Date: ' + (feature.properties.PHOTO_DATE || 'N/A') + '<br>';
                popupContent += 'Area: ' + (feature.properties.SHAPE_Area || 'N/A');
                popupContent += '</div>';
                layer.bindPopup(popupContent).openPopup();
            }
        });
    }
}).addTo(map);

L.geoJSON(cityBoundaryJson, {
    style: {
        color: '#000000',
        weight: 4,
        fillOpacity: 0
    }
}).addTo(map);

// add water level markers and menu
addWaterLevelMarkers(map);

// add climate layer
initializeClimateLayer();

// info popup controls
function toggleInfoPopup() {
    var popup = document.getElementById('info-popup');
    var backdrop = document.getElementById('backdrop');
    popup.classList.toggle('hidden');
    backdrop.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    var popup = document.getElementById('info-popup');
    var icon = document.getElementById('info-icon');
    var backdrop = document.getElementById('backdrop');
    if (!popup.contains(event.target) && !icon.contains(event.target)) {
        popup.classList.add('hidden');
        backdrop.classList.add('hidden');
    }
});
