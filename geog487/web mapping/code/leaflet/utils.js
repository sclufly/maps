// update legend based on layer type
function updateClimateLegend(layerType) {
  var legendDiv = document.querySelector('.legend');
  if (!legendDiv) return;
  
  var baseHTML = '<h4>Legend</h4>';
  baseHTML += '<div><svg width="20" height="20"><rect width="20" height="10" style="fill:#0066cc;fill-opacity:0.5;stroke:#0066cc;stroke-width:2"/></svg> Lakes and Rivers</div>';
  baseHTML += '<div><svg width="20" height="20"><line x1="0" y1="10" x2="20" y2="10" style="stroke:#000000;stroke-width:4"/></svg> Lethbridge City Boundary</div>';
  baseHTML += '<hr style="margin: 10px 0;">';
  baseHTML += '<div><strong>Reservoir Relative Water Level</strong></div>';
  baseHTML += '<div><svg width="20" height="20"><circle cx="10" cy="10" r="8" style="fill:#d32f2f;stroke:#2c5282;stroke-width:1"/></svg> Low (&lt; 33%)</div>';
  baseHTML += '<div><svg width="20" height="20"><circle cx="10" cy="10" r="8" style="fill:#fbc02d;stroke:#2c5282;stroke-width:1"/></svg> Moderate (33-67%)</div>';
  baseHTML += '<div><svg width="20" height="20"><circle cx="10" cy="10" r="8" style="fill:#388e3c;stroke:#2c5282;stroke-width:1"/></svg> High (67-100%)</div>';
  baseHTML += '<hr style="margin: 10px 0;">';
  
  if (layerType === 'drought') {
    baseHTML += '<div><strong>Drought Monitor</strong></div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FFFF00"/></svg> D0 - Abnormally Dry</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FCD37F"/></svg> D1 - Moderate Drought</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FFAA00"/></svg> D2 - Severe Drought</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#E60000"/></svg> D3 - Extreme Drought</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#730000"/></svg> D4 - Exceptional Drought</div>';
  } else if (layerType === 'precipitation') {
    baseHTML += '<div><strong>Accumulated Precipitation (mm)</strong></div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#990000"/></svg> ≤ 15</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#8C410B"/></svg> 15 to 30</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#A64C14"/></svg> 30 to 45</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#BF7F2C"/></svg> 45 to 70</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#E0C47E"/></svg> 70 to 100</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#F0E59E"/></svg> 100 to 150</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FFFFBD"/></svg> 150 to 200</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#E8FFBD"/></svg> 200 to 250</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#C1E697"/></svg> 250 to 350</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#77C777"/></svg> 350 to 450</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#31A359"/></svg> 450 to 600</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#BFFFFF"/></svg> 600 to 850</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#73E1FF"/></svg> 850 to 1075</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#4295C7"/></svg> 1075 to 1300</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#08529C"/></svg> 1300 to 1550</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#072F6B"/></svg> &gt; 1550</div>';
  } else if (layerType === 'temperature') {
    baseHTML += '<div><strong>Maximum Temperature (°C)</strong></div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#00007F"/></svg> ≤ -30</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#0000B9"/></svg> -30 to -27</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#0000E9"/></svg> -27 to -24</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#0014FF"/></svg> -24 to -21</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#0049FF"/></svg> -21 to -18</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#007EFF"/></svg> -18 to -15</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#00B3FF"/></svg> -15 to -12</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#00E9FF"/></svg> -12 to -9</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#19FFE4"/></svg> -9 to -6</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#43FFBA"/></svg> -6 to -3</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#6DFF90"/></svg> -3 to 0</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#98FF65"/></svg> 0 to 3</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#C3FF3A"/></svg> 3 to 6</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#EDFF10"/></svg> 6 to 9</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FFE500"/></svg> 9 to 12</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FFBA00"/></svg> 12 to 15</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FF9000"/></svg> 15 to 18</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FF6600"/></svg> 18 to 21</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FF3B00"/></svg> 21 to 24</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#FF1100"/></svg> 24 to 27</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#E90000"/></svg> 27 to 30</div>';
    baseHTML += '<div><svg width="20" height="15"><rect width="20" height="15" style="fill:#C50000"/></svg> &gt; 30</div>';
  }
  
  legendDiv.innerHTML = baseHTML;
}

// convert slider value to year/month
function sliderToDate(sliderValue) {
  var startYear = 2013;
  
  var totalMonths = parseInt(sliderValue);
  var year = startYear + Math.floor(totalMonths / 12);
  var month = (totalMonths % 12) + 1;
  
  return { year: year, month: month };
}

// create slider ticks and year labels
function createSliderTicks() {
  var ticksContainer = document.getElementById('sliderTicks');
  if (!ticksContainer) return;
  
  ticksContainer.innerHTML = '';
  
  var totalMonths = 144;
  
  // create ticks for each month (0 to 143)
  for (var i = 0; i <= totalMonths - 1; i++) {
    var tick = document.createElement('div');
    tick.className = 'tick';
    var percentage = (i / totalMonths) * 100;
    tick.style.left = percentage + '%';
    
    // check if this is January (year boundary)
    var date = sliderToDate(i);
    if (date.month === 1) {
      tick.className = 'tick year-tick';
      
      // add year label
      var label = document.createElement('div');
      label.className = 'year-label';
      label.textContent = date.year;
      label.style.left = percentage + '%';
      ticksContainer.appendChild(label);
    }
    
    ticksContainer.appendChild(tick);
  }
  
  // add the final tick for January 2025 (position 144)
  var finalTick = document.createElement('div');
  finalTick.className = 'tick year-tick';
  finalTick.style.left = '100%';
  
  var finalLabel = document.createElement('div');
  finalLabel.className = 'year-label';
  finalLabel.textContent = '2025';
  finalLabel.style.left = '100%';
  
  ticksContainer.appendChild(finalLabel);
  ticksContainer.appendChild(finalTick);
}

// snap slider to nearest month on mouse up
function snapSlider() {
  var slider = document.getElementById('timeSlider');
  var value = parseFloat(slider.value);
  var snapped = Math.round(value);
  
  if (value !== snapped) {
    slider.value = snapped;
    updateClimateLayer();
  }
}

// format date for display
function formatDate(year, month) {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month - 1] + ' ' + year;
}

// global chart instance
var currentChart = null;

// show graph for a reservoir
function showGraph(locationName, locationIndex) {
    var location = waterLevelCircles[locationIndex].location;
    
    var labels = [];
    var dataPoints = [];
    var currentDateIndex = -1;
    
    var slider = document.getElementById('timeSlider');
    var currentSliderValue = parseInt(slider.value);
    var currentDate = sliderToDate(currentSliderValue);
    
    var dataIndex = 0;
    
    // collect all data points from 2013-2024
    for (var year = 2013; year <= 2024; year++) {
        if (location.data[year]) {
            for (var month = 1; month <= 12; month++) {
                if (location.data[year][month] !== undefined) {
                    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
                    labels.push(monthName + ' ' + year);
                    dataPoints.push(location.data[year][month]);
                    
                    if (year === currentDate.year && month === currentDate.month) {
                        currentDateIndex = dataIndex;
                    }
                    dataIndex++;
                }
            }
        }
    }
    
    // show modal
    document.getElementById('graph-modal').classList.remove('hidden');
    document.getElementById('graph-backdrop').classList.remove('hidden');
    document.getElementById('graph-title').textContent = locationName + ' Water Level Over Time (2013-2024)';
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    // create new chart
    var ctx = document.getElementById('water-level-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Water Level (m)',
                data: dataPoints,
                borderColor: '#2c5282',
                backgroundColor: 'rgba(44, 82, 130, 0.1)',
                borderWidth: 2,
                pointRadius: function(context) {
                    return context.dataIndex === currentDateIndex ? 8 : 3;
                },
                pointBackgroundColor: function(context) {
                    return context.dataIndex === currentDateIndex ? '#d32f2f' : '#2c5282';
                },
                pointBorderColor: function(context) {
                    return context.dataIndex === currentDateIndex ? '#d32f2f' : '#2c5282';
                },
                pointBorderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.dataIndex === currentDateIndex) {
                                return '(Current Date)';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Water Level (meters)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        }
    });
}

// close graph modal
function closeGraph() {
    document.getElementById('graph-modal').classList.add('hidden');
    document.getElementById('graph-backdrop').classList.add('hidden');
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}
