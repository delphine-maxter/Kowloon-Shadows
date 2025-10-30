/* global L, locations */
(function() {
  const map = L.map('map', {
    center: [22.315, 114.169],
    zoom: 14,
    scrollWheelZoom: true
  });

  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];
  const latlngs = [];

  const redIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  locations.forEach((loc, idx) => {
    const m = L.marker([loc.lat, loc.lng], { icon: redIcon })
      .addTo(map)
      .bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);
    m.on('click', () => highlightListItem(loc.name));
    markers.push(m);
    latlngs.push([loc.lat, loc.lng]);
  });

  // Draw route polyline following the tour order
  const route = L.polyline(latlngs, { color: '#8B0000', weight: 4, opacity: 0.8 }).addTo(map);
  map.fitBounds(route.getBounds(), { padding: [30, 30] });

  // Link: clicking list focuses map and opens popup
  function highlightListItem(name) {
    const items = document.querySelectorAll('#locationList li');
    items.forEach(li => {
      li.style.textShadow = '';
      li.style.color = '';
    });
    const target = Array.from(items).find(li => li.dataset.name === name);
    if (target) {
      target.style.textShadow = '0 0 8px #ff2222';
      target.style.color = '#fff';
    }
  }

  document.getElementById('locationList').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const name = li.dataset.name;
    const lat = parseFloat(li.dataset.lat);
    const lng = parseFloat(li.dataset.lng);
    map.setView([lat, lng], 17, { animate: true });
    const marker = markers.find(m => {
      const ll = m.getLatLng();
      return Math.abs(ll.lat - lat) < 1e-6 && Math.abs(ll.lng - lng) < 1e-6;
    });
    if (marker) marker.openPopup();
    highlightListItem(name);
  });

  // Add scale and locate controls if browser supports geolocation
  L.control.scale().addTo(map);
  if ('geolocation' in navigator) {
    const locateBtn = L.control({ position: 'topleft' });
    locateBtn.onAdd = function() {
      const btn = L.DomUtil.create('button', 'leaflet-bar');
      btn.innerHTML = '📍';
      btn.title = 'Show my location';
      btn.style.cursor = 'pointer';
      btn.onclick = function() {
        map.locate({ setView: true, maxZoom: 16 });
      };
      return btn;
    };
    locateBtn.addTo(map);
    map.on('locationfound', (e) => {
      L.circle(e.latlng, { radius: e.accuracy, color: '#ff2222', weight: 2, fillOpacity: 0.15 }).addTo(map);
    });
  }
})();
