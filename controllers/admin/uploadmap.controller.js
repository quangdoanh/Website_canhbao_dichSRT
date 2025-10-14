const uploadMapModel = require('../../models/upload_map.model');
const moment = require("moment");
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const Log = require("../../helpers/loguser.helper")
module.exports.listMap = async (req, res) => {
  try {
    const filters = {
      loaibando: req.query.loaibando || null,
      ma_tinh: req.query.ma_tinh ? String(req.query.ma_tinh) : null, // ép string tại đây
    };

    const limit = 15;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const totalRecords = await uploadMapModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;
    const mapList = await uploadMapModel.getAllWithPagination(limit, offset, filters);
    const loaiMap = await uploadMapModel.getLoaiMap();
    const listTinh = await TinhModel.getAll();

    // console.log(loaiMap);
    res.render("admin/pages/map-list", {
      pageTitle: "Danh sách bản đồ",
      mapList,
      listTinh,
      loaiMap,
      pagination: { page, totalPages, totalRecords },
      limit,
      filters
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
};

// appList
module.exports.appListMap = async (req, res) => {
  try {
    const filters = {
      loaibando: req.query.loaibando || null,
      ma_tinh: req.query.ma_tinh ? String(req.query.ma_tinh) : null, // ép string tại đây
    };

    const limit = 15;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const totalRecords = await uploadMapModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;
    const mapList = await uploadMapModel.getAllWithPagination(limit, offset, filters);
    const loaiMap = await uploadMapModel.getLoaiMap();
    const listTinh = await TinhModel.getAll();

    // === Trả JSON cho mobile ===
    res.json({
      code: "success",
      message: "Lấy danh sách bản đồ thành công",
      data: {
        mapList,
        listTinh,
        loaiMap,
        pagination: { page, totalPages, totalRecords, limit },
        filters
      }
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({
      code: "error",
      message: "Có lỗi xảy ra, vui lòng thử lại!"
    });
  }
};

// appList
module.exports.createMap = async (req, res) => {
  try {
    const listTinh = await TinhModel.getAll();
    const loaiMap = await uploadMapModel.getLoaiMap();
    // console.log(listTinh);
    res.render("admin/pages/map-create", {
      pageTitle: "Tạo bản đồ",
      listTinh,
      loaiMap
    });
  } catch (err) {
    console.error("Create form error:", err);
    res.status(500).json({ code: "error", message: "Có lỗi xảy ra khi load form!" });
  }
};
module.exports.appCreateMap = async (req, res) => {
  try {
    const listTinh = await TinhModel.getAll();
    const loaiMap = await uploadMapModel.getLoaiMap();
    // console.log(listTinh);
    res.json({
      code: "success",
      listTinh,
      loaiMap
    })

  } catch (err) {
    console.error("Create form error:", err);
    res.status(500).json({ code: "error", message: "Có lỗi xảy ra khi load form!" });
  }
};
module.exports.createPostMap = async (req, res) => {
  try {
    const { thongtin, map, mota, matinh } = req.body;
    const file = req.file ? req.file.path : null;
    console.log(req.body)
    // ===== Validate input =====
    if (!thongtin || thongtin.trim() === "") {
      return res.status(400).json({
        code: "error",
        message: "Thông tin là bắt buộc",
      });
    }

    if (!map || map.trim() === "") {
      return res.status(400).json({
        code: "error",
        message: "Loại bản đồ là bắt buộc",
      });
    }

    if (!matinh) {
      return res.status(400).json({
        code: "error",
        message: "Chọn tỉnh là bắt buộc",
      });
    }

    // Kiểm tra file
    if (!file) {
      return res.status(400).json({
        code: "error",
        message: "Vui lòng upload file bản đồ",
      });
    }

    // Kiểm tra matinh có tồn tại trong DB không
    const tinh = await TinhModel.getById(parseInt(matinh));
    if (!tinh) {
      return res.status(400).json({
        code: "error",
        message: "Mã tỉnh không hợp lệ",
      });
    }

    // ===== Nếu hợp lệ thì tạo mới =====
    const data = {
      thongtin,
      loaibando: map,
      file,
      mota,
      matinh: String(matinh),
    };
    console.log(data);
    const newMap = await uploadMapModel.create(data);

    const user = req.account?.email;
    if (user) {
      Log.logUser(user, req.originalUrl, req.method, "Tạo dữ liệu bản đồ")
    }

    req.flash("success", "Thêm mới dữ liệu thành công");

    res.json({
      code: "success",
      message: "Thêm dữ liệu thành công",
      data: newMap,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server: " + err.message,
    });
  }
};


module.exports.editMap = async (req, res) => {
  try {
    const { id } = req.params;
    const dataMap = await uploadMapModel.findById(id);
    const listTinh = await TinhModel.getAll();
    const loaiMap = await uploadMapModel.getLoaiMap();
    console.log(dataMap);
    const tinh = await TinhModel.getById(parseInt(dataMap.ma_tinh))
    dataMap.ten_tinh = tinh.ten_tinh;
    res.render("admin/pages/map-edit", {
      pageTitle: "Sửa bản đồ",
      dataMap,
      listTinh,
      loaiMap
    });

  } catch (err) {
    console.error("Edit form error:", err);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server: " + err.message,
    });
  }
};
// appEditMap
module.exports.appEditMap = async (req, res) => {
  try {
    const { id } = req.params;
    const dataMap = await uploadMapModel.findById(id);

    if (!dataMap) {
      return res.status(404).json({
        code: "error",
        message: "Không tìm thấy bản đồ"
      });
    }

    // Lấy tên tỉnh theo mã tỉnh
    const tinh = await TinhModel.getById(parseInt(dataMap.ma_tinh));
    dataMap.ten_tinh = tinh ? tinh.ten_tinh : null;

    // Lấy danh sách tỉnh (nếu mobile cũng cần)
    const listTinh = await TinhModel.getAll();
    const loaiMap = await uploadMapModel.getLoaiMap();
    // === Trả JSON thay vì render ===
    res.json({
      code: "success",
      message: "Lấy dữ liệu bản đồ thành công",
      data: {
        dataMap,
        listTinh,
        loaiMap
      }
    });
  } catch (err) {
    console.error("Edit form error:", err);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server: " + err.message
    });
  }
};

// appEditMap
// module.exports.editPatchMap = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { thongtin, map, mota, file, matinh } = req.body;
//     console.log("Cập nhật: ",req.body);

//     // ===== Validate cơ bản =====
//     if (!thongtin || thongtin.trim() === "") {
//       return res.status(400).json({ code: "error", message: "Vui lòng nhập thông tin!" });
//     }

//     if (!map || map.trim() === "") {
//       return res.status(400).json({ code: "error", message: "Vui lòng chọn loại bản đồ!" });
//     }

//     if (!matinh) {
//       return res.status(400).json({ code: "error", message: "Vui lòng chọn tỉnh!" });
//     }

//     // Check tỉnh có tồn tại không
//     const tinh = await TinhModel.getById(parseInt(matinh));
//     if (!tinh) {
//       return res.status(400).json({ code: "error", message: "Mã tỉnh không hợp lệ!" });
//     }

//     // ===== Chuẩn hóa dữ liệu cập nhật =====
//     const updatedFields = {
//       thongtin: thongtin.trim(),
//       loaibando: map.trim(),
//       mota: mota ? mota.trim() : null,
//       file: req.file ? req.file.path : file || null,
//       matinh: matinh
//     };

//     // ===== Update DB =====
//     const updatedMap = await uploadMapModel.updateById(id, updatedFields);

//     if (!updatedMap) {
//       return res.status(404).json({
//         code: "error",
//         message: "Không tìm thấy bản ghi để cập nhật"
//       });
//     }

//     req.flash("success", "Cập nhật dữ liệu thành công");
//     return res.json({
//       code: "success",
//       message: "Cập nhật dữ liệu thành công",
//       data: updatedMap
//     });

//   } catch (err) {
//     console.error("Update error:", err);
//     return res.status(500).json({
//       code: "error",
//       message: "Lỗi server: " + err.message,
//     });
//   }
// };
module.exports.editPatchMap = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedFields = {};

    // console.log("db cap nhat", req.body)

    // Nếu gửi thongtin
    if (updates.thongtin !== undefined) {
      if (updates.thongtin.trim() === "") {
        return res.status(400).json({ code: "error", message: "Thông tin không được rỗng!" });
      }
      updatedFields.thongtin = updates.thongtin.trim();
    }

    // Nếu gửi map
    if (updates.map !== undefined) {
      if (updates.map.trim() === "") {
        return res.status(400).json({ code: "error", message: "Loại bản đồ không được rỗng!" });
      }
      updatedFields.loaibando = updates.map.trim();
    }

    // Nếu gửi mô tả
    if (updates.mota !== undefined) {
      updatedFields.mota = updates.mota.trim() || null;
    }

    // Nếu có file upload mới
    if (req.file) {
      updatedFields.file = req.file.path;
    } else if (updates.file !== undefined) {
      updatedFields.file = updates.file || null;
    }

    // Nếu gửi mã tỉnh
    if (updates.matinh !== undefined) {
      const tinh = await TinhModel.getById(parseInt(updates.matinh));
      if (!tinh) {
        return res.status(400).json({ code: "error", message: "Mã tỉnh không hợp lệ!" });
      }
      updatedFields.ma_tinh = parseInt(updates.matinh);
    }

    // Nếu không có trường nào để update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ code: "error", message: "Không có dữ liệu để cập nhật!" });
    }

    // Update DB
    const updatedMap = await uploadMapModel.updateById(id, updatedFields);

    if (!updatedMap) {
      return res.status(404).json({ code: "error", message: "Không tìm thấy bản ghi để cập nhật" });
    }

    const user = req.account?.email;
    if (user) {
      Log.logUser(user, req.originalUrl, req.method, "Cập nhật dữ liệu bản đồ")
    }

    req.flash("success", "Cập nhật dữ liệu thành công");
    return res.json({
      code: "success",
      message: "Cập nhật dữ liệu thành công",
      data: updatedMap
    });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server: " + err.message,
    });
  }
};

module.exports.deleteMap = async (req, res) => {


  try {

    const { id } = req.params;
    const success = await uploadMapModel.deleteById(id);

    if (success) {
      req.flash("success", "Xóa thành công");
      const user = req.account?.email;
      if (user) {
        Log.logUser(user, req.originalUrl, req.method, "Xóa bản đồ")
      }
      res.json({
        code: "success",
        message: "Xóa thành công",
      })
    } else {
      res.json({
        code: "error",
        message: "Xóa thất bại",
      })
    }

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      code: "error",
      message: "Lỗi server: " + err.message,
    });
  }
}