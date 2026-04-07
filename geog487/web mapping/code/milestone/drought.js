// drought severity styles and definitions
var droughtStyles = {
    'D0': { color: '#ffff00', fillColor: '#ffff00', fillOpacity: 0.3, label: 'D0 (Abnormally Dry)' },
    'D1': { color: '#ffd37f', fillColor: '#fcd37f', fillOpacity: 0.4, label: 'D1 (Moderate Drought)' },
    'D2': { color: '#ffaa00', fillColor: '#ffaa00', fillOpacity: 0.5, label: 'D2 (Severe Drought)' },
    'D3': { color: '#e60000', fillColor: '#e60000', fillOpacity: 0.6, label: 'D3 (Extreme Drought)' },
    'D4': { color: '#730000', fillColor: '#730000', fillOpacity: 0.7, label: 'D4 (Exceptional Drought)' }
};

// store drought layers
var droughtLayers2025 = [];
var droughtLayers2024 = [];
var droughtLayers2019 = [];

// load drought data sequentially (so higher severity appears on top)
function loadDroughtData(year, levels, varPrefix) {
    var layers;
    if (year === 2025) layers = droughtLayers2025;
    else if (year === 2024) layers = droughtLayers2024;
    else layers = droughtLayers2019;
    
    levels.forEach(function(level) {
        var varName = varPrefix + level + 'Json';
        var data = window[varName];
        
        if (data) {
            var layer = L.geoJSON(data, {
                style: {
                    color: droughtStyles[level].color,
                    weight: 1,
                    fillColor: droughtStyles[level].fillColor,
                    fillOpacity: droughtStyles[level].fillOpacity
                },
                onEachFeature: function(feature, layer) {
                    layer.bindPopup('<b>Drought Level (Aug ' + year + '):</b> ' + droughtStyles[level].label);
                }
            });
            layers.push(layer);
            console.log(year + ' ' + level + ' drought layer loaded');
        }
    });
}

// add drought data for each year
function addDroughtData(map) {
    // 2025
    loadDroughtData(2025, ['D0', 'D1', 'D2', 'D3'], 'drought2508');
    droughtLayers2025.forEach(function(layer) { layer.addTo(map); });

    // 2024
    loadDroughtData(2024, ['D0', 'D1', 'D2', 'D3'], 'drought2408');

    // 2019
    loadDroughtData(2019, ['D0', 'D1', 'D2'], 'drought1908');
}

// add drought year menu control
function addDroughtMenu(map) {
    var yearToggle = L.control({ position: 'topright' });

    yearToggle.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'control-box');
        div.innerHTML = '<h4>Drought Month/Year</h4>';
        div.innerHTML += '<button class="control-button" data-year="2019">08/2019</button>';
        div.innerHTML += '<button class="control-button" data-year="2024">08/2024</button>';
        div.innerHTML += '<button class="control-button active" data-year="2025">08/2025</button>';
        
        L.DomEvent.disableClickPropagation(div);
        
        return div;
    };

    yearToggle.addTo(map);

    // click handlers for year toggle
    setTimeout(function() {
        document.querySelectorAll('.control-box .control-button[data-year]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var year = parseInt(this.getAttribute('data-year'));
                
                document.querySelectorAll('.control-box .control-button[data-year]').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                
                // toggle layers
                if (year === 2025) {
                    droughtLayers2019.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2024.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2025.forEach(function(layer) { layer.addTo(map); });
                } else if (year === 2024) {
                    droughtLayers2025.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2019.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2024.forEach(function(layer) { layer.addTo(map); });
                } else {
                    droughtLayers2025.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2024.forEach(function(layer) { map.removeLayer(layer); });
                    droughtLayers2019.forEach(function(layer) { layer.addTo(map); });
                }
            });
        });
    }, 500);
}
