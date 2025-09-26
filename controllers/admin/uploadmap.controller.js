const uploadMapModel = require('../../models/upload_map.model');
const moment = require("moment");
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
module.exports.listMap = async (req, res) => {
  try {
    const filters = {
      loaibando: req.query.loaibando || null,
      ma_tinh: req.query.ma_tinh ? String(req.query.ma_tinh) : null, // ép string tại đây
    };

    const limit = 20;
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
module.exports.createMap = async (req, res) => {
    try {
        const listTinh = await TinhModel.getAll();
        // console.log(listTinh);
        res.render("admin/pages/map-create", {
            pageTitle: "Tạo bản đồ",
            listTinh
        });
    } catch (err) {
        console.error("Create form error:", err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra khi load form!" });
    }
};

module.exports.createPostMap = async (req, res) => {
    try {
        const { thongtin, map, mota, matinh } = req.body;
        const file = req.file ? req.file.path : null;
        const data = {
            thongtin,
            loaibando: map,
            file,
            mota,
            matinh: String(matinh)
        }
        // console.log("dữ liều nè bro: ",data)
        const newMap = await uploadMapModel.create(data);
        req.flash("success","Thêm mới dữ liệu thành công");
        res.json({
            code: "success",
            message: "Thêm dữ liệu thành công",
            data: newMap
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
        console.log(dataMap);
        const tinh = await TinhModel.getById(parseInt(dataMap.ma_tinh)) 
        dataMap.ten_tinh = tinh.ten_tinh;
        res.render("admin/pages/map-edit", {
            pageTitle: "Sửa bản đồ",
            dataMap,
            listTinh
        });
       
    } catch (err) {
        console.error("Edit form error:", err);
        return res.status(500).json({
            code: "error",
            message: "Lỗi server: " + err.message,
        });
    }
};
module.exports.editPatchMap = async (req, res) => {
    try {
        const { id } = req.params;
        const { thongtin, map, mota, file, matinh} = req.body;

        const updatedFields = {
            thongtin,
            loaibando: map,
            mota,
            file: req.file ? req.file.path : file, // file luôn có giá trị
            matinh
        };

        const updatedMap = await uploadMapModel.updateById(id, updatedFields);

        if (!updatedMap) {
            return res.status(404).json({
                code: "error",
                message: "Không tìm thấy bản ghi để cập nhật"
            });
        }
        req.flash("success", "Cập nhật dữ liêu thành công");
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
}
module.exports.deleteMap = async (req, res) => {


    try {

        const { id } = req.params;
        const success = await uploadMapModel.deleteById(id);

        if (success) {
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