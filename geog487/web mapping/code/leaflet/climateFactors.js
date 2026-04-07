// store current active layer
var currentClimateLayer = null;

// get drought layer
function droughtLayer(year, month) {
  var nextMonth = month === 12 ? 1 : month + 1;
  var nextYear = month === 12 ? year + 1 : year;
  var monthStr = month.toString().padStart(2, '0');
  var nextMonthStr = nextMonth.toString().padStart(2, '0');
  
  return L.esri.imageMapLayer({
    url: 'https://agriculture.canada.ca/imagery-images/rest/services/canadian_drought_monitor/ImageServer',
    mosaicRule: {
      mosaicMethod: 'esriMosaicAttribute',
      where: `dateEnd >= DATE '${year}-${monthStr}-01' AND dateEnd < DATE '${nextYear}-${nextMonthStr}-01'`,
      sortField: 'dateEnd',
      ascending: false
    },
    renderingRule: {
      rasterFunction: 'canadian_drought_monitor'
    },
    opacity: 0.7
  });
}

// get precipitation layer
function precipitationLayer(year, month) {
  var nextMonth = month === 12 ? 1 : month + 1;
  var nextYear = month === 12 ? year + 1 : year;
  var monthStr = month.toString().padStart(2, '0');
  var nextMonthStr = nextMonth.toString().padStart(2, '0');
  
  return L.esri.imageMapLayer({
    url: 'https://agriculture.canada.ca/imagery-images/rest/services/agclimate/accumulated_precipitation/ImageServer',
    mosaicRule: {
      mosaicMethod: 'esriMosaicAttribute',
      where: `dateEnd >= DATE '${year}-${monthStr}-01' AND dateEnd < DATE '${nextYear}-${nextMonthStr}-01' AND tType = 'ac_30'`,
      sortField: 'dateEnd',
      ascending: false
    },
    renderingRule: {
      rasterFunction: 'ac_30'
    },
    opacity: 0.7
  });
}

// get temperature layer
function temperatureLayer(year, month) {
  var nextMonth = month === 12 ? 1 : month + 1;
  var nextYear = month === 12 ? year + 1 : year;
  var monthStr = month.toString().padStart(2, '0');
  var nextMonthStr = nextMonth.toString().padStart(2, '0');
  
  return L.esri.imageMapLayer({
    url: 'https://agriculture.canada.ca/imagery-images/rest/services/agclimate/maximum_temperature/ImageServer',
    mosaicRule: {
      mosaicMethod: 'esriMosaicAttribute',
      where: `dateEnd >= DATE '${year}-${monthStr}-01' AND dateEnd < DATE '${nextYear}-${nextMonthStr}-01' AND tType = 'tx_07'`,
      sortField: 'dateEnd',
      ascending: false
    },
    renderingRule: {
      rasterFunction: 'tx'
    },
    opacity: 0.7
  });
}

var updateTimer = null;

// update the displayed layer
function updateClimateLayer() {
  var layerType = document.getElementById('layerSelect').value;
  var sliderValue = document.getElementById('timeSlider').value;
  var date = sliderToDate(sliderValue);
  var year = date.year;
  var month = date.month;
  
  document.getElementById('dateLabel').textContent = formatDate(year, month);
  
  // update water level circles immediately
  if (typeof updateWaterLevelCircles === 'function') {
    updateWaterLevelCircles(year, month);
  }
  
  if (updateTimer) {
    clearTimeout(updateTimer);
  }
  
  // wait 200ms before making the API call
  updateTimer = setTimeout(function() {
    if (currentClimateLayer) {
      map.removeLayer(currentClimateLayer);
    }
    
    // Add new layer based on selection
    if (layerType === 'drought') {
      currentClimateLayer = droughtLayer(year, month);
    } else if (layerType === 'precipitation') {
      currentClimateLayer = precipitationLayer(year, month);
    } else if (layerType === 'temperature') {
      currentClimateLayer = temperatureLayer(year, month);
    }
    
    if (currentClimateLayer) {
      currentClimateLayer.addTo(map);
    }
    
    // update legend
    updateClimateLegend(layerType);
  }, 100);
}

// initialize with drought layer for October 2019
function initializeClimateLayer() {
  if (typeof loadWaterLevelData === 'function') {
    loadWaterLevelData(function() {
      var date = sliderToDate(81);
      if (typeof updateWaterLevelCircles === 'function') {
        updateWaterLevelCircles(date.year, date.month);
      }
    });
  }
  
  // create slider ticks
  createSliderTicks();
  
  // add snap functionality on mouseup and touchend
  var slider = document.getElementById('timeSlider');
  slider.addEventListener('mouseup', snapSlider);
  slider.addEventListener('touchend', snapSlider);
  
  // set slider to October 2019 (value 81: (2019-2013)*12 + (10-1) = 81)
  var date = sliderToDate(81);
  document.getElementById('dateLabel').textContent = formatDate(date.year, date.month);
  currentClimateLayer = precipitationLayer(date.year, date.month);
  currentClimateLayer.addTo(map);
  updateClimateLegend('precipitation');
}
