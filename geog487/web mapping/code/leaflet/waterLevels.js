// water level locations and files
var waterLevels = [
    { name: 'Oldman River', lat: 49.709167, lng: -112.862778, csvFile: 'Oldman_River_Water_Level.csv', data: {} },
    { name: 'Oldman Reservoir', lat: 49.611944, lng: -114.053056, csvFile: 'Oldman_Reservoir_Water_Level.csv', data: {} },
    { name: 'St. Mary\'s Reservoir', lat: 49.362778, lng: -113.114444, csvFile: 'St_Mary_Reservoir_Water_Level.csv', data: {} },
    { name: 'Waterton Reservoir', lat: 49.320000, lng: -113.683889, csvFile: 'Waterton_Reservoir_Water_Level.csv', data: {} }
];

var waterLevelCircles = [];
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// parse CSV data for a location
function parseWaterLevelData(csvText) {
    var lines = csvText.trim().split('\n');
    var data = {};
    
    for (var i = 2; i < lines.length; i++) {
        var parts = lines[i].split(',');
        if (parts.length < 3) continue;
        
        var year = parseInt(parts[2]);
        if (isNaN(year)) continue;
        
        data[year] = {};
        
        for (var m = 0; m < 12; m++) {
            var value = parseFloat(parts[3 + m]);
            if (!isNaN(value)) {
                data[year][m + 1] = value;
            }
        }
    }
    
    return data;
}

// calculate historical min and max for a location from 2013-2024 data only
function calculateHistoricalRange(location) {
    var allValues = [];
    
    for (var year in location.data) {
        var yearNum = parseInt(year);
        // Only include data from 2013 onwards
        if (yearNum < 2013) continue;
        
        for (var month in location.data[year]) {
            var value = location.data[year][month];
            if (value !== null && value !== undefined) {
                allValues.push(value);
            }
        }
    }
    
    return {
        min: Math.min(...allValues),
        max: Math.max(...allValues)
    };
}

// load CSV data for all locations
function loadWaterLevelData(callback) {
    var loadedCount = 0;
    
    waterLevels.forEach(function(location) {
        fetch('data/' + location.csvFile)
            .then(response => response.text())
            .then(csvText => {
                location.data = parseWaterLevelData(csvText);
                location.historicalRange = calculateHistoricalRange(location);
                loadedCount++;
                
                if (loadedCount === waterLevels.length && callback) {
                    callback();
                }
            })
            .catch(error => {
                console.error('Error loading ' + location.csvFile + ':', error);
                loadedCount++;
                
                if (loadedCount === waterLevels.length && callback) {
                    callback();
                }
            });
    });
}

// get water level for a specific location, year, and month
function getWaterLevel(location, year, month) {
    if (location.data[year] && location.data[year][month]) {
        return location.data[year][month];
    }
    return null;
}

// calculate percentage relative to historical range (2013-2024)
function calculatePercentage(currentLevel, location) {
    if (currentLevel === null || currentLevel === undefined) return 0;
    if (!location.historicalRange) return 0;
    
    var range = location.historicalRange.max - location.historicalRange.min;
    if (range === 0) return 50; // If no variation, show 50%
    
    var percentage = ((currentLevel - location.historicalRange.min) / range) * 100;
    return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
}

// add water level circles
function addWaterLevelMarkers(map) {
    waterLevels.forEach(function(location, index) {
        var outerCircle = L.circle([location.lat, location.lng], {
            color: '#000000',
            fillColor: '#ffffff',
            fillOpacity: 0.80,
            weight: 2,
            radius: 4000 // 4km radius for outer circle
        }).addTo(map);
        
        var innerCircle = L.circle([location.lat, location.lng], {
            color: '#000000',
            fillColor: '#4a90e2',
            fillOpacity: 0.80,
            weight: 1,
            radius: 0 // set based on data
        }).addTo(map);
        
        waterLevelCircles.push({
            location: location,
            outer: outerCircle,
            inner: innerCircle
        });
        
        // add popup
        outerCircle.bindPopup('<b>' + location.name + '</b><br><span id="popup-' + index + '">Loading...</span>');
        innerCircle.bindPopup('<b>' + location.name + '</b><br><span id="popup-' + index + '">Loading...</span>');
    });
}

// update water level circles based on selected date
function updateWaterLevelCircles(year, month) {
    waterLevelCircles.forEach(function(item, index) {
        var currentLevel = getWaterLevel(item.location, year, month);
        var percentage = calculatePercentage(currentLevel, item.location);
        
        var maxRadius = 4000;
        var currentRadius = maxRadius * (percentage / 100);
        item.inner.setRadius(currentRadius);
        
        var fillColor;
        if (percentage < 33) {
            fillColor = '#d32f2f'; // red - low
        } else if (percentage < 67) {
            fillColor = '#fbc02d'; // yellow - moderate
        } else {
            fillColor = '#388e3c'; // green - high
        }
        item.inner.setStyle({ fillColor: fillColor });
        
        // update popup content
        var popupContent = '<b>' + item.location.name + '</b><br>';
        if (currentLevel !== null && item.location.historicalRange) {
            popupContent += 'Level: ' + currentLevel.toFixed(2) + ' m<br>';
            popupContent += 'Historical Low (2013-2024): ' + item.location.historicalRange.min.toFixed(2) + ' m<br>';
            popupContent += 'Historical High (2013-2024): ' + item.location.historicalRange.max.toFixed(2) + ' m<br>';
            popupContent += 'Relative Level: ' + percentage.toFixed(1) + '%<br>';
            popupContent += '<button onclick="showGraph(\'' + item.location.name.replace(/'/g, "\\'") + '\', ' + index + ')" style="margin-top: 10px; padding: 5px 10px; background: #2c5282; color: white; border: none; border-radius: 3px; cursor: pointer;">Show Graph</button>';
        } else {
            popupContent += 'No data available';
        }
        
        item.outer.setPopupContent(popupContent);
        item.inner.setPopupContent(popupContent);
        
        // update popup spans if they exist
        var popupSpan = document.getElementById('popup-' + index);
        if (popupSpan) {
            if (currentLevel !== null && item.location.historicalRange) {
                popupSpan.innerHTML = 'Level: ' + currentLevel.toFixed(2) + ' m<br>Relative Level: ' + percentage.toFixed(1) + '%';
            } else {
                popupSpan.innerHTML = 'No data available';
            }
        }
    });
}
