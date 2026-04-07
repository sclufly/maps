// initialize the map
var map = L.map('map').setView([49.527987, -113.280431], 9);

// add base layer
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

positron.addTo(map);

// add scale bar
L.control.scale({
    position: 'bottomleft',
    imperial: true,
    metric: true
}).addTo(map);

// add north arrow
var northArrow = L.control({ position: 'topleft' });

northArrow.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'north-arrow');
    div.innerHTML = '<div class="north-arrow-inner">↑<br><span>N</span></div>';
    return div;
};

northArrow.addTo(map);

// add data attribution text box
var attribution = L.control({ position: 'bottomright' });

attribution.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'data-attribution');
    div.innerHTML = 'Data layers were retrieved from the City of Lethbridge and the Government of Canada.';
    return div;
};

attribution.addTo(map);

// add legend
var legend = L.control({ position: 'topright' });

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Legend</h4>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#0066cc;fill-opacity:0.5;stroke:#0066cc;stroke-width:2"/></svg> Lakes and Rivers</div>';
    div.innerHTML += '<div><svg width="20" height="20"><line x1="0" y1="10" x2="20" y2="10" style="stroke:#000000;stroke-width:4"/></svg> Lethbridge City Boundary</div>';
    div.innerHTML += '<div style="margin-top:10px;"><b>Drought Severity:</b></div>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#ffff00;fill-opacity:0.3;stroke:#ffff00;stroke-width:1"/></svg> D0 (Abnormally Dry)</div>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#fcd37f;fill-opacity:0.4;stroke:#ffd37f;stroke-width:1"/></svg> D1 (Moderate Drought)</div>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#ffaa00;fill-opacity:0.5;stroke:#ffaa00;stroke-width:1"/></svg> D2 (Severe Drought)</div>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#e60000;fill-opacity:0.6;stroke:#e60000;stroke-width:1"/></svg> D3 (Extreme Drought)</div>';
    div.innerHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#730000;fill-opacity:0.7;stroke:#730000;stroke-width:1"/></svg> D4 (Exceptional Drought)</div>';
    return div;
};

legend.addTo(map);

// add reservoir markers and menu
addReservoirMarkers(map);
addReservoirMenu(map);

// add basic layer GeoJSONs in order (water first, then boundary)
L.geoJSON(albertaWaterClipJson, {
    style: {
        color: '#0066cc',
        weight: 2,
        fillOpacity: 0.5
    },
    onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
            if (feature.properties) {
                var popupContent = '<div style="max-height: 200px; overflow-y: auto;">';
                popupContent += Object.keys(feature.properties).map(function(key) {
                    return '<b>' + key + ':</b> ' + feature.properties[key];
                }).join('<br>');
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

// add drought data and menu
addDroughtData(map);
addDroughtMenu(map);
