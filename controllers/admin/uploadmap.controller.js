const uploadMapModel = require('../../models/upload_map.model');
const moment = require("moment");
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
module.exports.listMap = async (req, res) => {
    const { matinh } = req.params;
    let mapList = []
    try {
        mapList = await uploadMapModel.getAll(matinh)
    } catch (error) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }

    res.render("admin/pages/map-list", {
        pageTitle: "Danh sách  bản đồ",
        mapList: mapList,
        matinh: matinh
    });
}
module.exports.createMap = async (req, res) => {
    const { matinh } = req.params;

    res.render("admin/pages/map-create", {
        pageTitle: " Tạo bản đồ",
        matinh: matinh
    });
}
module.exports.createPostMap = async (req, res) => {
    try {
        const { matinh } = req.params;
        const { thongtin, map, mota } = req.body;

        console.log(thongtin, map, mota)
        const file = req.file ? req.file.path : null;

        const newMap = await uploadMapModel.create({
            thongtin,
            loaibando: map,
            file,
            mota,
            ma_tinh: matinh
        });

        console.log(matinh)
        console.log(newMap)

        return res.json({
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
    const { matinh, id } = req.params
    let dataMap;
    try {
        dataMap = await uploadMapModel.findById(id)
        console.log("FILE:", dataMap.file)


    } catch (error) {
        console.error("Upload error:", err);
        return res.status(500).json({
            code: "error",
            message: "Lỗi server: " + err.message,
        });
    }

    res.render("admin/pages/map-edit", {
        pageTitle: " Sửa  bản đồ",
        matinh: matinh,
        dataMap: dataMap
    });
}
module.exports.editPatchMap = async (req, res) => {
    try {
        const { id } = req.params;
        const { thongtin, map, mota, file } = req.body;

        const updatedFields = {
            thongtin,
            loaibando: map,
            mota,
            file: req.file ? req.file.path : file // file luôn có giá trị
        };

        const updatedMap = await uploadMapModel.updateById(id, updatedFields);

        if (!updatedMap) {
            return res.status(404).json({
                code: "error",
                message: "Không tìm thấy bản ghi để cập nhật"
            });
        }

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