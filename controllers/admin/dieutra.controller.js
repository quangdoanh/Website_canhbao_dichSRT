const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const DieuTraModel = require('../../models/dieutra.model');
const moment = require("moment");

module.exports.listDieuTra = async (req, res) => {
  try {
    // ===== Lấy filters từ query =====
    const filters = {
      keyword: req.query.keyword || "",
      ma_tinh: req.query.ma_tinh || null,
      ma_huyen: req.query.ma_huyen || null,
      ma_xa: req.query.ma_xa || null,
    };

    const limit = 4;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // ===== Tổng số bản ghi =====
    const totalRecords = await DieuTraModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // ===== Lấy danh sách phân trang =====
    let dieutraList = await DieuTraModel.getAllWithPagination(limit, offset, filters);
    dieutraList = dieutraList.map(item => ({
      ...item,
      dtra_dateFormat: item.dtra_date
        ? moment(item.dtra_date).format("DD/MM/YYYY")
        : ""
    }));

    // ===== Danh sách Tỉnh =====
    const ListTinh = await TinhModel.getAll();

    // ===== Danh sách Huyện (lọc theo tỉnh nếu có) =====
    let ListHuyen;
    if (filters.ma_tinh) {
      ListHuyen = await HuyenModel.getByProvince(filters.ma_tinh);
    } else {
      ListHuyen = await HuyenModel.getAll();
    }

    // ===== Danh sách Xã (lọc theo huyện nếu có) =====
    let ListXa;
    if (filters.ma_huyen) {
      ListXa = await XaModel.getByDistrict(filters.ma_huyen);
    } else {
      ListXa = await XaModel.getAll();
    }

    // ===== Gom nhóm xã theo huyện =====
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
    res.render("admin/pages/dieu-tra-list", {
      pageTitle: "Danh sách điều tra",
      dieutraList,
      ListTinh,
      ListHuyen,
      ListXaTheoHuyen,
      pagination: { page, totalPages, totalRecords },
      limit,
      filters,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách điều tra:", err);
    res.status(500).json("error", "Có lỗi xảy ra khi lấy danh sách điều tra!");
  }
};



// api cho app
module.exports.appListDieuTra = async (req, res) => {
  try {
    // ===== Lấy filters từ query =====
    const filters = {
      keyword: req.query.keyword || "",
      ma_tinh: req.query.ma_tinh || null,
      ma_huyen: req.query.ma_huyen || null,
      ma_xa: req.query.ma_xa || null,
    };

    const limit = parseInt(req.query.limit) || 10; // cho app tuỳ chọn limit
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // ===== Tổng số bản ghi =====
    const totalRecords = await DieuTraModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // ===== Lấy danh sách phân trang =====
    let dieutraList = await DieuTraModel.getAllWithPagination(limit, offset, filters);
    dieutraList = dieutraList.map(item => ({
      ...item,
      dtra_dateFormat: item.dtra_date
        ? moment(item.dtra_date).format("DD/MM/YYYY")
        : ""
    }));

    // ===== Danh sách Tỉnh =====
    const ListTinh = await TinhModel.getAll();

    // ===== Danh sách Huyện (lọc theo tỉnh nếu có) =====
    let ListHuyen;
    if (filters.ma_tinh) {
      ListHuyen = await HuyenModel.getByProvince(filters.ma_tinh);
    } else {
      ListHuyen = await HuyenModel.getAll();
    }

    // ===== Danh sách Xã (lọc theo huyện nếu có) =====
    let ListXa;
    if (filters.ma_huyen) {
      ListXa = await XaModel.getByDistrict(filters.ma_huyen);
    } else {
      ListXa = await XaModel.getAll();
    }

    // ===== Gom nhóm xã theo huyện =====
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

    // ===== Trả JSON cho client =====
    res.json({
      code: "success",
      data: {
        dieutraList,
        ListTinh,
        ListHuyen,
        ListXaTheoHuyen,
        pagination: { page, totalPages, totalRecords },
        limit,
        filters,
      }
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách điều tra:", err);
    res.status(500).json({
      code: "error",
      message: "Có lỗi xảy ra khi lấy danh sách điều tra!"
    });
  }
};

//end api cho app
module.exports.createDieuTra = async (req, res) => {
  try {
    // 1. Lấy danh sách tỉnh
    const ListTinh = await TinhModel.getAll(); // [{ma_tinh, ten_tinh}, ...]

    // 2. Lấy danh sách huyện (mỗi huyện cần có cả ma_tinh để lọc)
    const ListHuyen = await HuyenModel.getAll(); 
    // => [{ma_huyen, ten_huyen, ma_tinh}, ...]

    // 3. Lấy danh sách xã theo huyện
    const ListXa = await XaModel.getAll(); 
    // => [{ma_xa, ten_xa, ma_huyen}, ...]

    // Gom nhóm xã theo huyện
    const ListXaTheoHuyen = [];
    const grouped = {};

    ListXa.forEach(xa => {
      if (!grouped[xa.ma_huyen]) {
        grouped[xa.ma_huyen] = [];
      }
      grouped[xa.ma_huyen].push({
        ma_xa: xa.ma_xa,
        ten_xa: xa.ten_xa
      });
    });

    for (const ma_huyen in grouped) {
      ListXaTheoHuyen.push({
        huyen: ma_huyen,
        dsXa: grouped[ma_huyen]
      });
    }

    // 4. Render ra view
    res.render("admin/pages/dieu-tra-create", {
      pageTitle: "Tạo Dữ liệu",
      ListTinh,
      ListHuyen,
      ListXaTheoHuyen
    });
  } catch (err) {
    console.error("Lỗi createDieuTra:", err);
    res.status(500).send("Có lỗi xảy ra");
  }
};


module.exports.createDieuTraPost = async (req, res) => {
    try {
        const { matinh, mahuyen, maxa, sosau, socay, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo } = req.body;
        const dtra_date = new Date();
        // Lấy user_id từ session (hoặc null nếu không có)
        const user_id = req.account?.id || 0;

        // Ép kiểu số
        const so_sau_non = parseInt(sosau);
        const so_cay = parseInt(socay);
        const duong_kinh_tb_num = parseFloat(duong_kinh_tb);
        // Validate bắt buộc
        if (!loai_cay || !["thongmavi", "thongnhua"].includes(loai_cay)) {
            res.status(400).json({
                code: "error",
                message: "Loài cây không hợp lệ"
            });
            return;
        }
        if (duong_kinh_tb === undefined || isNaN(duong_kinh_tb_num) || duong_kinh_tb_num <= 0) {
            res.status(400).json({
                code: "error",
                message: "Đường kính TB phải nhập và > 0"
            });
        }

        // Tạo bản ghi mới
        const newDieuTra = await DieuTraModel.create({
            ma_tinh: matinh,
            ma_huyen: mahuyen,
            ma_xa: maxa,
            so_sau_non,
            so_cay,
            dtra_date,
            user_id,
            dia_chi_cu_the: dia_chi_cu_the,
            loai_cay: loai_cay,
            duong_kinh_tb: duong_kinh_tb_num,
            tk:tk, 
            khoanh:khoanh, 
            lo:lo

        });

        console.log("Bản ghi mới:", newDieuTra);
        // Thông báo thành công
        req.flash("success", "Tạo mới thành công");
        // Trả về JSON bao gồm dtra_date
        res.json({ code: "success", data: newDieuTra });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
}


module.exports.editDieuTra = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Lấy bản ghi điều tra (có join tên tỉnh/huyện/xã)
    const dieutra = await DieuTraModel.getByIdWithNames(id);
    if (!dieutra) {
      req.flash("error", "Không tìm thấy bản ghi!");
      return res.redirect(`/${pathAdmin}/dieutra/list`);
    }

    // 2. Lấy toàn bộ danh sách tỉnh
    const ListTinh = await TinhModel.getAll(); // [{ma_tinh, ten_tinh}, ...]

    // 3. Lấy toàn bộ danh sách huyện
    const ListHuyen = await HuyenModel.getAll(); 
    // [{ma_huyen, ten_huyen, ma_tinh}, ...]

    // 4. Lấy toàn bộ danh sách xã
    const ListXa = await XaModel.getAll(); 
    // [{ma_xa, ten_xa, ma_huyen}, ...]

    // 5. Gom nhóm xã theo huyện (giống create)
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
    console.log(dieutra);
    // 6. Render ra form edit
    res.render("admin/pages/dieu-tra-edit", {
      pageTitle: "Chỉnh sửa Dữ liệu điều tra",
      dieutra,
      ListTinh,
      ListHuyen,
      ListXaTheoHuyen,
    });
  } catch (err) {
    console.error("Lỗi khi load form edit điều tra:", err);
    res
      .status(500)
      .json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
};




module.exports.editDieuTraPatch = async (req, res) => {

    const { id } = req.params;
    const { matinh, mahuyen, maxa, sosau, socay, dia_chi_cu_the, loai_cay, duong_kinh_tb, tk, khoanh, lo } = req.body;
    try {


        // 1. Lấy bản ghi hiện tại
        const dieutra = await DieuTraModel.getById(id);
        if (!dieutra) {
            return res.status(404).json({ code: "error", message: "Bản ghi không tồn tại!" });
        }

        // 2. Ép kiểu số
        const so_sau_non = parseInt(sosau) || 0;
        const so_cay = parseInt(socay) || 0;
        const duong_kinh_tb_num = parseFloat(duong_kinh_tb);

        // 3. Update bản ghi (giữ nguyên user_id và dtra_date)
        const updatedDieuTra = await DieuTraModel.update(id, {
            ma_tinh: matinh || dieutra.ma_tinh,
            ma_huyen: mahuyen || dieutra.ma_huyen,
            ma_xa: maxa || dieutra.ma_xa,
            so_sau_non:so_sau_non || dieutra.so_sau_non,
            so_cay:so_cay || dieutra.so_cay,
            dtra_date: dieutra.dtra_date,  
            user_id: dieutra.user_id,       
            dia_chi_cu_the: dia_chi_cu_the || dieutra.dia_chi_cu_the,
            loai_cay: loai_cay,
            duong_kinh_tb: duong_kinh_tb_num,
            tk: tk || dieutra.tk,             
            khoanh: khoanh || dieutra.khoanh,
            lo: lo || dieutra.lo
        });

        req.flash("success", "Cập nhật thành công")
        // 4. Trả về JSON
        res.json({ code: "success", data: updatedDieuTra });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
};

module.exports.deleteDieuTraPatch = async (req, res) => {

    console.log("Chạy vào đây")
    try {
        const { id } = req.params;

        const updatedDieuTra = await DieuTraModel.softDelete(id);

        if (!updatedDieuTra) {
            return res.status(404).json({ code: "error", message: "Bản ghi không tồn tại!" });
        }
        req.flash("success", "Xóa thành công")
        res.json({
            code: "success",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
};