// reservoir locations
var reservoirs = [
    { name: 'Oldman Reservoir', lat: 49.584170, lng: -113.962265 },
    { name: 'St. Mary\'s Reservoir', lat: 49.326442, lng: -113.193541 },
    { name: 'Waterton Reservoir', lat: 49.302121, lng: -113.677015 }
];

// add reservoir markers
function addReservoirMarkers(map) {
    reservoirs.forEach(function(reservoir) {
        var marker = L.marker([reservoir.lat, reservoir.lng]).addTo(map);
        marker.bindPopup('<b>' + reservoir.name + '</b>');
    });
}

// add reservoir navigation menu
function addReservoirMenu(map) {
    var menu = L.control({ position: 'topright' });

    menu.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'control-box');
        div.innerHTML = '<h4>Reservoirs</h4>';
        
        reservoirs.forEach(function(reservoir) {
            div.innerHTML += '<div class="control-button" data-lat="' + reservoir.lat + '" data-lng="' + reservoir.lng + '">' + reservoir.name + '</div>';
        });
        
        L.DomEvent.disableClickPropagation(div);
        
        return div;
    };

    menu.addTo(map);

    // click handlers for menu items
    setTimeout(function() {
        document.querySelectorAll('.control-box .control-button[data-lat]').forEach(function(item) {
            item.addEventListener('click', function() {
                var lat = parseFloat(this.getAttribute('data-lat'));
                var lng = parseFloat(this.getAttribute('data-lng'));
                map.setView([lat, lng], 13);
            });
        });
    }, 100);
}
