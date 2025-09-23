const wmsUrl = 'http://115.146.126.49:8081/geoserver/iTwood_Workspace/wms';
const wfsUrl = 'http://115.146.126.49:8081/geoserver/iTwood_Workspace/wfs';

const map = L.map('map').setView([18.3, 105.9], 6);

// Nền OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let wfsLayer;
let wmsLayer;
let selectedLayer = null;

/* ===============
    Hàm load WMS 
=================*/
const loadWMS = (layerName) => {
  if (wmsLayer) map.removeLayer(wmsLayer);

  wmsLayer = L.tileLayer.wms(wmsUrl, {
    layers: `iTwood_Workspace:${layerName}`,
    format: 'image/png',
    transparent: true
  }).addTo(map);
  // Đưa WMS lên trên cùng
  wmsLayer.bringToFront();
};

/* ===============
      Hàm load WFS 
  =================*/

const loadWFSByCondition = (layerName, conditions) => {
  if (wfsLayer) map.removeLayer(wfsLayer);
  let cqlFilter = `xa='${conditions.xa}' AND tk='${conditions.tk}' AND khoanh='${conditions.khoanh}' AND lo='${conditions.lo}'`;

  console.log(cqlFilter)

  const url = `${wfsUrl}?service=WFS&version=1.1.0&request=GetFeature&typeName=iTwood_Workspace:${layerName}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;


  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("WFS", data);

      if (!data.features || data.features.length === 0) {
        console.warn("Không tìm thấy feature nào với điều kiện:", conditions);
        return;
      }

      // Thêm các feature vào bản đồ
      wfsLayer = L.geoJSON(data.features, {
        style: { color: "red", weight: 3, fillColor: "yellow", fillOpacity: 0.3, interactive: true },
      }).addTo(map);

      map.fitBounds(wfsLayer.getBounds());

      let featureLayer;
      wfsLayer.eachLayer((layer) => {
        featureLayer = layer;
      });

      if (featureLayer && featureLayer.feature && featureLayer.feature.properties) {
        var props = featureLayer.feature.properties;
        var center = featureLayer.getBounds().getCenter();

        const content = `
          <div class="info-popup">
            <table style="font-family: 'Times New Roman', Times, serif;">
              <tr><th>Xã</th><td>${props.xa || ''}</td></tr>
              <tr><th>Tiểu Khu</th><td>${props.tk || ''}</td></tr>
              <tr><th>Khoanh</th><td>${props.khoanh || ''}</td></tr>
              <tr><th>Lô</th><td>${props.lo || ''}</td></tr>
              <tr><th>Diện tích</th><td>${props.dtich || ''}</td></tr>
              <tr><th>Loại rừng</th><td>${props.sldlr || ''}</td></tr>
              <tr><th>Năm trồng</th><td>${props.namtr || ''}</td></tr>
              <tr><th>Chủ rừng</th><td>${props.churung || ''}</td></tr>
            </table>
          </div>
        `;

        L.popup()
          .setLatLng(center)
          .setContent(content)
          .openOn(map);
      }


    })
    .catch(err => console.error("Lỗi tải WFS:", err));
};


/* COMBOBOX LOAD MAP WMS */

const comboBoxMap = document.getElementById("layerSelect")
comboBoxMap.addEventListener("change", (e) => {
  const selected = e.target.value;

  if (selected) {
    loadWMS(selected);

    // Lấy URL hiện tại
    const url = new URL(window.location.href);

    // Gắn thêm (hoặc thay thế) query param bando
    url.searchParams.set("bando", selected);

    window.location.href = url;

    console.log("URL mới:", url.toString());
  }


});

/* KHI LOAD LẠI LẤY THEO COMBOBOX */
window.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  let bando = url.searchParams.get("bando");

  if (!bando) {
    // Nếu chưa có query param → lấy giá trị mặc định từ combobox
    bando = comboBoxMap.value;
    url.searchParams.set("bando", bando);
    window.location.href = url
  }

  // Gán giá trị vào combobox
  comboBoxMap.value = bando;

  // Gọi loadWMS theo combobox
  loadWMS(bando);
});
;

/*  FIND WFS THEO ITEM TRONG BANG THEO COMBOBOX  */
document.querySelectorAll('.info-table tbody tr').forEach(row => {
  row.addEventListener('click', () => {

    //console.log("bảng", row.dataset.xa)

    // Xóa class active ở tất cả các dòng
    document.querySelectorAll('.info-table tbody tr').forEach(r => r.classList.remove('active'));

    // Thêm class active cho dòng vừa click
    row.classList.add('active');

    const conditions = {
      xa: row.dataset.xa,
      tk: row.dataset.tk,
      khoanh: row.dataset.khoanh,
      lo: row.dataset.lo
    };
    console.log("lựa chọn", comboBoxMap.value)
    loadWFSByCondition(comboBoxMap.value, conditions);
  });
});

/* FIND THEO BANG RUNG - ADMIN */

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const xa = params.get("xa");
  const tk = params.get("tk");
  const khoanh = params.get("khoanh");
  const lo = params.get("lo");
  console.log("Full search:", window.location.search);
  console.log("chạy vafp rừng", params.get("xa"))
  if (xa && tk && khoanh && lo) {
    loadWFSByCondition(comboBoxMap.value, { xa, tk, khoanh, lo });
    const infoTable = document.querySelector(".info-table");
    if (infoTable) {
      infoTable.style.display = "none";
    }
  }
});



// ===== Layer để chứa các đối tượng vẽ =====
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// === zooom to nhỏ =====/
map.removeControl(map.zoomControl);
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Control vẽ
let drawControl = new L.Control.Draw({
  draw: {
    polygon: false,
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false,

  },
  edit: {
    featureGroup: drawnItems,
    edit: false,
    remove: false
  }
});
map.addControl(drawControl);

// Biến lưu polygon vừa vẽ
let latestLayer = null;

// Khi vẽ xong → chỉ add vào bản đồ, chưa lưu
// map.on(L.Draw.Event.CREATED, (e) => {
//   drawnItems.addLayer(e.layer);
//   Swal.fire({
//     icon: 'info',
//     title: ' Polygon đã được vẽ',
//     text: 'Bấm nút ba chấm  để lưu tất cả vào CSDL.'
//   });
// });

/* ============== =
 Custom control Lưu
 ==================*/
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
        menuDiv.style.top = '160px';
        menuDiv.style.right = '80px';
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
                    title: 'Lỗi khi lưu polygon!',
                    text: data.message
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
//map.addControl(saveBtn);

/* ========================== 
   Control nền chọn nền bản đồ
  ============================*/
const basemapControl = L.Control.extend({
  options: { position: 'bottomright' },

  onAdd: (map) => {
    const container = L.DomUtil.create('div', 'basemapControl');

    // Nút chính
    const mainBtn = L.DomUtil.create('div', 'basemap-main', container);

    // Overlay icon + text
    const overlay = L.DomUtil.create('div', 'basemap-overlay', mainBtn);
    const overlayIcon = L.DomUtil.create('i', 'fas fa-layer-group', overlay);
    const overlayText = L.DomUtil.create('span', '', overlay);
    overlayText.innerText = 'Lớp bản đồ'; // mặc định

    // Menu ẩn chứa các lựa chọn
    const menu = L.DomUtil.create('div', 'basemap-menu', container);

    // Các basemap bạn định nghĩa
    const basemaps = {
      GoogleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      GoogleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      GoogleSatellite: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      GoogleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      OpenMapStreets: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    };

    // Thêm mặc định
    basemaps.GoogleStreets.addTo(map);

    // Tạo danh sách menu trực tiếp từ basemaps
    Object.keys(basemaps).forEach((key) => {
      const item = L.DomUtil.create('div', 'basemap-item', menu);
      item.innerText = key; // hiển thị đúng tên key gốc

      item.addEventListener('click', () => {
        // Xóa layer cũ
        Object.values(basemaps).forEach(l => map.removeLayer(l));
        // Thêm layer mới
        basemaps[key].addTo(map);

        // Chỉ cập nhật text, không đè mất CSS/icon
        overlayText.innerText = key;

        // Ẩn menu
        menu.style.display = 'none';
      });
    });

    // Toggle menu khi click
    mainBtn.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    L.DomEvent.disableClickPropagation(container);
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

    fetch(`/polygons/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          Swal.fire('Đã xóa!', data.message, 'success');
          loadWFS(); // load lại WFS để cập nhật map
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi khi xóa polygon!',
            text: data.message
          });
        }
      })
      .catch(err => console.error("Lỗi xóa:", err));
  });
}
