const moment = require("moment");
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const WeatherModel = require("../../models/weather.model");
//lấy ra danh sách theo page gửi lên
module.exports.list = async (req, res) => {
  try {
    // ===== Lấy filters từ query =====
    const filters = {
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      ma_tinh: req.query.ma_tinh || null,
      ma_huyen: req.query.ma_huyen || null,
      ma_xa: req.query.ma_xa || null,
    };

    const limit = 15; // số bản ghi mỗi trang
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // ===== Tổng số bản ghi có filter =====
    const totalRecords = await WeatherModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // ===== Lấy danh sách phân trang theo filter =====
    const dataList = await WeatherModel.getAllWithPagination(limit, offset, filters);

    // Format ngày ngay_cap_nhat
    for (const item of dataList) {
      item.ngay_cap_nhat = item.ngay_cap_nhat
        ? moment(item.ngay_cap_nhat).format("DD/MM/YYYY")
        : null;
    }

    // ===== Danh sách tỉnh =====
    const ListTinh = await TinhModel.getAll();

    // ===== Danh sách huyện (lọc theo tỉnh nếu có) =====
    let ListHuyen;
    if (filters.ma_tinh) {
      ListHuyen = await HuyenModel.getByProvince(filters.ma_tinh);
    } else {
      ListHuyen = await HuyenModel.getAll();
    }

    // ===== Danh sách xã (lọc theo huyện nếu có) =====
    let ListXa;
    if (filters.ma_huyen) {
      ListXa = await XaModel.getByDistrict(filters.ma_huyen);
    } else {
      ListXa = await XaModel.getAll();
    }

    // Gom nhóm xã theo huyện
    const ListXaTheoHuyen = [];
    const grouped = {};
    ListXa.forEach((xa) => {
      if (!grouped[xa.ma_huyen]) {
        grouped[xa.ma_huyen] = [];
      }
      grouped[xa.ma_huyen].push({
        ma_xa: xa.ma_xa,
        ten_xa: xa.ten_xa,
      });
    });
    for (const ma_huyen in grouped) {
      ListXaTheoHuyen.push({
        huyen: ma_huyen,
        dsXa: grouped[ma_huyen],
      });
    }

    // ===== Render ra view =====
    res.render("admin/pages/weather-data-list", {
      pageTitle: "Dữ liệu thời tiết",
      dataList,
      ListTinh,
      ListHuyen,
      ListXaTheoHuyen,
      pagination: { page, totalPages, totalRecords },
      limit,
      filters, // để giữ giá trị filter khi render
    });
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu thời tiết:", err);
    res.status(500).send("Lỗi server");
  }
};


//xem chi tiết 1 bản ghi
module.exports.viewDetail =async (req,res) => {
    const {id} = req.params;
    const dataDetail = await WeatherModel.getByIdWithNames(parseInt(id));
    dataDetail.ngay_cap_nhatFomat =  moment(dataDetail.ngay_cap_nhat).format("DD/MM/YYYY")
    res.render("admin/pages/weather-data-detail",{
        pageTitle:"Chi tiết dữ liệu thời tiết",
        dataDetail:dataDetail
    })
}

//hiển thị thông tin ra form sửa
module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Lấy bản ghi weather (có join tên tỉnh/huyện/xã)
    const dataDetail = await WeatherModel.getByIdWithNames(id);
    if (!dataDetail) {
      req.flash("error", "Không tìm thấy bản ghi!");
      return res.redirect(`/${pathAdmin}/weather-data/list`);
    }

    // 2. Lấy toàn bộ danh sách tỉnh
    const listTinh = await TinhModel.getAll(); 
    // [{ma_tinh, ten_tinh}, ...]

    // 3. Lấy toàn bộ danh sách huyện
    const listHuyen = await HuyenModel.getAll(); 
    // [{ma_huyen, ten_huyen, ma_tinh}, ...]

    // 4. Lấy toàn bộ danh sách xã
    const listXa = await XaModel.getAll(); 
    // [{ma_xa, ten_xa, ma_huyen}, ...]

    // 5. Gom nhóm xã theo huyện
    const listXaTheoHuyen = [];
    const grouped = {};

    listXa.forEach((xa) => {
      if (!grouped[xa.ma_huyen]) {
        grouped[xa.ma_huyen] = [];
      }
      grouped[xa.ma_huyen].push({
        ma_xa: xa.ma_xa,
        ten_xa: xa.ten_xa,
      });
    });

    for (const ma_huyen in grouped) {
      listXaTheoHuyen.push({
        huyen: ma_huyen,
        dsXa: grouped[ma_huyen],
      });
    }
    if (dataDetail.ma_xa) {
      const xa = listXa.find((x) => x.ma_xa === dataDetail.ma_xa);
      if (xa) {
        dataDetail.huyen_from_xa = xa.ma_huyen;
        const huyen = listHuyen.find((h) => h.ma_huyen === xa.ma_huyen);
        if (huyen) {
          dataDetail.tinh_from_xa = huyen.ma_tinh;
        }
      }
    }

    // console.log("data thời tiết: ",dataDetail);
    // 6. Render ra form edit
    res.render("admin/pages/weather-data-edit", {
      pageTitle: "Cập nhật bản ghi thời tiết",
      dataDetail:dataDetail,
      listTinh,
      listHuyen,
      listXaTheoHuyen,
    });

  } catch (err) {
    console.error("Lỗi khi load form edit weather-data:", err);
    res
      .status(500)
      .json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // --- Các field cho phép cập nhật ---
    const allowedFields = [
      "ma_tinh", "ma_huyen", "ma_xa",
      "temp_min", "temp_max", "temp_mean",
      "rain_min", "rain_max", "rain_mean",
      "wind_min", "wind_max", "wind_mean",
      "cap_so_p"
    ];

    let filteredUpdates = {};

    for (let key of allowedFields) {
      let value = updates[key];

      // Bỏ qua nếu không gửi hoặc rỗng
      if (value === undefined || value === null || value === "") continue;

      // --- Field số thực ---
      if (
        [
          "temp_min", "temp_max", "temp_mean",
          "rain_min", "rain_max", "rain_mean",
          "wind_min", "wind_max", "wind_mean"
        ].includes(key)
      ) {
        let num = parseFloat(value);
        if (!isNaN(num) && num >= 0) {
          filteredUpdates[key] = num;
        }
      }
      // --- Field số nguyên ---
      else if (["cap_so_p"].includes(key)) {
        let num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
          filteredUpdates[key] = num;
        }
      }
      // --- Field chuỗi ---
      else {
        filteredUpdates[key] = value.toString().trim();
      }
    }

    // --- Nếu có mã tỉnh → lấy tên tỉnh ---
    if (filteredUpdates.ma_tinh) {
      const tinh = await TinhModel.getById(filteredUpdates.ma_tinh);
      if (tinh) filteredUpdates.ten_tinh = tinh.ten_tinh;
    }

    // --- Nếu có mã huyện → lấy tên huyện ---
    if (filteredUpdates.ma_huyen) {
      const huyen = await HuyenModel.getById(filteredUpdates.ma_huyen);
      if (huyen) filteredUpdates.ten_huyen = huyen.ten_huyen;
    }

    // --- Nếu có mã xã → lấy tên xã ---
    if (filteredUpdates.ma_xa) {
      const xa = await XaModel.getById(filteredUpdates.ma_xa);
      if (xa) filteredUpdates.ten_xa = xa.ten_xa;
    }

    console.log("Dữ liệu cập nhật:", filteredUpdates);

    // Nếu không có field nào để update thì bỏ qua
    if (Object.keys(filteredUpdates).length === 0) {
      return res.json({ code: "error", message: "Không có dữ liệu để cập nhật!" });
    }

    // --- Cập nhật DB ---
    const updatedData = await WeatherModel.update(id, filteredUpdates);

    console.log("Dữ liệu mới cập nhật: ", await WeatherModel.getByIdWithNames(id));

    if (!updatedData) {
      return res.json({ code: "error", message: "Không tìm thấy bản ghi!" });
    }

    req.flash("success", "Cập nhật thành công");
    res.json({ code: "success", message: "Cập nhật thành công!" });

  } catch (err) {
    console.error("Lỗi editPatch weather:", err);
    res.json({ code: "error", message: "Lỗi server!" });
  }
};

