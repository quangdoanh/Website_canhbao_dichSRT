let map;

document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo map tại Việt Nam
  map = L.map('map').setView([16.047079, 108.206230], 5);

  // Nền bản đồ
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Marker mẫu
  const markers = [
    { coords: [10.7769, 106.7009], popup: "TP. Hồ Chí Minh - Vùng nghiêm trọng", color: "red" },
    { coords: [21.0285, 105.8542], popup: "Hà Nội - Vùng cảnh báo", color: "orange" },
    { coords: [19.8075, 105.7769], popup: "Thanh Hóa - Vùng cảnh báo", color: "orange" },
    { coords: [13.7563, 100.5018], popup: "Bangkok - Vùng an toàn", color: "green" }
  ];

  markers.forEach(m => {
    const marker = L.circleMarker(m.coords, {
      radius: 10,
      color: m.color,
      fillColor: m.color,
      fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(m.popup);
  });

  // ✅ Polygon cho Hà Nội
  const hanoiPolygon = L.polygon([
    [21.05, 105.80],
    [21.05, 105.90],
    [21.00, 105.95],
    [20.98, 105.85]
  ], {
    color: "orange",
    fillColor: "orange",
    fillOpacity: 0.3
  }).addTo(map);
  hanoiPolygon.bindPopup("Vùng cảnh báo Hà Nội");

  // ✅ Polygon cho TP.HCM
  const hcmPolygon = L.polygon([
    [10.80, 106.65],
    [10.82, 106.75],
    [10.76, 106.78],
    [10.74, 106.70]
  ], {
    color: "red",
    fillColor: "red",
    fillOpacity: 0.3
  }).addTo(map);
  hcmPolygon.bindPopup("Vùng nghiêm trọng TP.HCM");
});

// ✅ Lấy vị trí hiện tại
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 12);

      L.marker([lat, lng]).addTo(map)
        .bindPopup("Bạn đang ở đây").openPopup();
    }, err => {
      alert("Không thể lấy vị trí hiện tại!");
    });
  } else {
    alert("Trình duyệt không hỗ trợ Geolocation!");
  }
}
