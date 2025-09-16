const map = L.map('map').setView([18.3, 105.9], 9);

// Nền OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let wfsLayer;

let selectedLayer = null;

const loadWFS = () => {
  if (wfsLayer) map.removeLayer(wfsLayer);

  fetch("http://115.146.126.49:8081/geoserver/iTwood_Workspace/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=iTwood_Workspace:HaTinh_SRT_wgs84&outputFormat=application/json")
    .then(res => res.json())
    .then(data => {
      console.log("WFS Data:", data);

      wfsLayer = L.geoJSON(data, {
        style: {
          color: "green",       // viền xanh
          weight: 3,            // độ dày viền
          fillColor: "red",     // màu nền
          fillOpacity: 0.3,     // độ trong suốt
          interactive: true
        },
        onEachFeature: (features, layer) => {

          layer.on("click", () => {
            if (selectedLayer) {
              wfsLayer.resetStyle(selectedLayer); // reset layer cũ
            }
            console.log("Chạy vào đây")

            selectedLayer = layer;
            layer.setStyle({ color: "blue", weight: 3, fillOpacity: 0.5 });

            const props = features.properties;

            const infoDiv = document.querySelector('.search-panel');
            console.log(infoDiv)
            infoDiv.innerHTML = `
            <div class="info-box">
                <h3>Thông tin vùng</h3>
                <table>
                  <tr><td><b>Huyện</b></td><td>${props.huyen || '---'}</td></tr>
                  <tr><td><b>Xã</b></td><td>${props.xa || '---'}</td></tr>
                  <tr><td><b>Diện tích</b></td><td>${props.dtich || '---'} km²</td></tr>
                </table>
              </div>
      `;
          });

          //Gắn popup với nút Xóa
          layer.bindPopup(`
                        <b>Polygon ID:</b> ${features.id} <br>
                        <button onclick="deletePolygon('${features.id}')">🗑 Xóa</button>
                    `);


        }

      }).addTo(map);

      // Zoom nhỏ lại sau khi lưu của dữ liệu
      //map.fitBounds(wfsLayer.getBounds());
    })
    .catch(err => console.error("Lỗi tải WFS:", err));
};
// load lần đầu
loadWFS();

// ===== Layer để chứa các đối tượng vẽ =====
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Control vẽ
let drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false,

  },
  edit: {
    featureGroup: drawnItems,
    edit: false,
    remove: true
  }
});
map.addControl(drawControl);

// Biến lưu polygon vừa vẽ
let latestLayer = null;

// Khi vẽ xong → chỉ add vào bản đồ, chưa lưu
map.on(L.Draw.Event.CREATED, (e) => {
  drawnItems.addLayer(e.layer);
  // Swal.fire({
  //   icon: 'info',
  //   title: ' Polygon đã được vẽ',
  //   text: 'Bấm nút ba chấm  để lưu tất cả vào CSDL.'
  // });
});

// Custom control Lưu
const saveControl = L.Control.extend({
  options: { position: 'topright' }, // vị trí trên map
  onAdd: (map) => {
    const container = L.DomUtil.create('button', 'mapMenu');
    container.innerHTML = '...';
    container.style.backgroundColor = 'white';
    container.style.padding = '5px 10px';
    container.style.cursor = 'pointer';
    container.style.fontSize = '14px';
    container.style.borderRadius = '6px';

    //Ngăn map kéo khi click vào button
    L.DomEvent.disableClickPropagation(container);

    container.addEventListener('click', () => {
      let menuDiv = document.getElementById('mapMenu');
      if (!menuDiv) {
        menuDiv = document.createElement('div');
        menuDiv.id = 'mapMenu';
        menuDiv.style.position = 'absolute';
        menuDiv.style.top = '180px';
        menuDiv.style.right = '10px';
        menuDiv.style.backgroundColor = 'white';
        menuDiv.style.border = '1px solid #ccc';
        menuDiv.style.borderRadius = '6px';
        menuDiv.style.padding = '10px';
        menuDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        menuDiv.style.zIndex = 1000;

        // Viết HTML bên trong menu
        menuDiv.innerHTML = `
                <button class="saveBtnMap" >
                  <i class="fa-regular fa-bookmark"></i>Lưu Polygon
                </button>
            `;

        document.body.appendChild(menuDiv);

        // Khi bấm nút Lưu
        const buttonSavePolygon = document.querySelector(".saveBtnMap")
        if (buttonSavePolygon) {

          buttonSavePolygon.addEventListener("click", () => {
            if (drawnItems.getLayers().length === 0) {
              Swal.fire({
                icon: 'error',
                title: ' Bạn chưa vẽ polygon nào!'
              });
            }

            // Convert tất cả polygon trong drawnItems sang GeoJSON
            const geojson = drawnItems.toGeoJSON();

            // Lưu vào Db
            fetch('/polygons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                geometries: geojson.features.map(f => f.geometry)   // lấy danh sách geometry   
              })
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  Swal.fire({
                    icon: 'success',
                    title: ' Polygon đã lưu thành công!',
                    text: `Số lượng thành công: ${data.inserted.length}`
                  });


                  console.log(" Các ID thành công:", data.inserted);


                  console.log(" Số lượng thành công:", data.inserted.length);


                  console.log(" Số lượng thất bại:", data.failed.length);
                  latestLayer = null; // reset
                  drawnItems.clearLayers();

                  // refresh lại dữ liệu từ WFS
                  loadWFS();
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi lưu polygon!'
                  });
                }
              })
              .catch(err => console.error("Lỗi fetch:", err));
          });

        }

      } else {
        // Toggle ẩn/hiện menu nếu đã tồn tại
        menuDiv.style.display = menuDiv.style.display === 'none' ? 'block' : 'none';
      }
    });

    return container;


  }
});



// Thêm control vào map
const saveBtn = new saveControl();
map.addControl(saveBtn);

// Control nền chọn nền bản đồ
const basemapControl = L.Control.extend({
  options: { position: 'topright' },

  onAdd: (map) => {
    const container = L.DomUtil.create('div', 'basemapControl');
    container.style.padding = '8px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '6px';
    container.style.backgroundColor = 'white';

    L.DomEvent.disableClickPropagation(container);

    // Các tile layers
    const layers = {
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
      light: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png')
    };

    // Add OSM mặc định
    layers.osm.addTo(map);

    // Tạo 3 nút chấm tròn
    Object.entries({
      osm: "OSM",
      satellite: "Vệ tinh",
      light: "Nền sáng"
    }).forEach(([key, title]) => {
      const dot = L.DomUtil.create('div', 'basemap-dot', container);
      dot.title = title;
      dot.style.width = '14px';
      dot.style.height = '14px';
      dot.style.borderRadius = '50%';
      dot.style.border = '2px solid #333';
      dot.style.cursor = 'pointer';
      dot.style.backgroundColor = key === "osm" ? '#333' : '#fff';

      dot.addEventListener('click', () => {
        // Xóa tất cả layers cũ
        Object.values(layers).forEach(l => map.removeLayer(l));
        // Thêm layer được chọn
        layers[key].addTo(map);

        // Đổi màu nút active
        const allDots = container.querySelectorAll('.basemap-dot');
        allDots.forEach(d => d.style.backgroundColor = '#fff');
        dot.style.backgroundColor = '#333';
      });
    });

    return container;
  }
});
const mapControl = new basemapControl();
map.addControl(mapControl);

// xóa polygon 
const deletePolygon = (str) => {

  const id = str.split(".")[1];

  Swal.fire({
    title: `Bạn có chắc muốn xóa polygon ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Có',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    // Nếu nhấn Cancel hoặc đóng popup → return ngay, không xóa
    if (!result.isConfirmed) return;

    fetch('/polygons/' + id, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          Swal.fire('Đã xóa!', data.message, 'success');
          loadWFS(); // load lại WFS để cập nhật map
        }
      })
      .catch(err => console.error("Lỗi xóa:", err));
  });
}
