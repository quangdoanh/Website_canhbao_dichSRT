const BenhHaiKeo = require('../../models/benhhaikeo.model');
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const DieuTraModel = require('../../models/dieutra.model');
const moment = require("moment");
const uploadMapModel = require('../../models/upload_map.model');
const Log = require("../../helpers/loguser.helper")

module.exports.listDulieuBHLK = async (req, res) => {
    console.log("BHLK")
    const { matinh } = req.params;
    let listDulieuBHLK = []
    try {
        const limit = 15;
        let page = 1;

        if (req.query.page) {
            const pageCurrent = parseInt(req.query.page)
            if (pageCurrent > 0) page = pageCurrent
        }
        const skip = (page - 1) * limit
        const TotalDuLieuBHLK = await BenhHaiKeo.getAllByMaTinh(matinh);
        const totalPage = Math.ceil(TotalDuLieuBHLK.length / limit);

        const pagination = { skip, TotalDuLieuBHLK, totalPage }
        const data = await BenhHaiKeo.findByMaTinh(matinh, skip, limit);

        listDulieuBHLK = data.map(item => ({
            id: item.id,
            tinh: item.tinh,
            huyen: item.huyen,
            xa: item.xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dientich: item.dtich,
            loairung: item.sldlr,
            namtr: item.namtr,
            churung: item.churung
        }))
        res.render("admin/pages/dulieuBHLK-list", {
            pageTitle: "Dữ liệu BHLK",
            listDulieuBHLK,
            pagination,
            matinh
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}

module.exports.editDulieuBHLK = async (req, res) => {
    const { matinh, id } = req.params;
    let dataBHLK
    try {
        dataBHLK = await BenhHaiKeo.findById(id);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

    res.render("admin/pages/dulieuBHLK-edit", {
        pageTitle: "Cập nhật Dữ liệu BHLK",
        dataBHLK,
        matinh
    });
}

module.exports.editPatchDulieuBHLK = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.phancap != '3') {
            if (await BenhHaiKeo.deletewebById(id) && await BenhHaiKeo.updatePhanCapById(id, req.body.phancap)) {
                const user = req.account?.email;
                if (user) {
                    Log.logUser(user, req.originalUrl, req.method, "Sửa dữ liệu bhlk")
                }


                res.json({ code: "success", message: "Sửa thành công" })
            } else {
                res.json({ code: "error", message: "Sửa thất bại" })
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}

module.exports.createDulieuBHLK = async (req, res) => {
    const { matinh } = req.params;
    let ListXaTheoHuyen = [];
    let ListHuyen = []
    try {
        ListHuyen = await HuyenModel.getByProvince(matinh)
        for (const huyen of ListHuyen) {
            const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);
            ListXaTheoHuyen.push({ huyen: huyen.ma_huyen, dsXa });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

    res.render("admin/pages/dulieuBHLK-create", {
        pageTitle: "Tạo Dữ liệu BHLK",
        ListHuyen,
        ListXaTheoHuyen,
        matinh
    });
}

// ===================== DIỄU TRA =====================
module.exports.listDieuTraBHLK = async (req, res) => {
    const { matinh } = req.params;
    try {
        const keyword = req.query.keyword || "";
        let dieutraList = keyword ? await DieuTraModel.search(keyword, matinh) : await DieuTraModel.getAllByMaTinh(matinh);

        const listTinh = await TinhModel.getAll();
        const listHuyen = await HuyenModel.getByProvince(matinh);
        const listXaTheoHuyen = {};
        for (const huyen of listHuyen) {
            listXaTheoHuyen[huyen.ma_huyen] = await XaModel.getByDistrict(huyen.ma_huyen);
        }

        dieutraList = dieutraList.map(item => {
            const tinh = listTinh.find(t => String(t.ma_tinh) === String(item.ma_tinh));
            const huyen = listHuyen.find(h => String(h.ma_huyen) === String(item.ma_huyen));
            const xaList = listXaTheoHuyen[item.ma_huyen] || [];
            const xa = xaList.find(x => String(x.ma_xa) === String(item.ma_xa));

            return {
                ...item,
                ten_tinh: tinh ? tinh.ten_tinh : "",
                ten_huyen: huyen ? huyen.ten_huyen : "",
                ten_xa: xa ? xa.ten_xa : "",
                createdAtFormat: item.dtra_date ? moment(item.dtra_date).format("DD/MM/YYYY") : ""
            };
        });

        res.render("admin/pages/dieu-tra-list", {
            pageTitle: "Danh sách điều tra",
            matinh,
            dieutraList
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Có lỗi xảy ra khi lấy danh sách điều tra!");
    }
}

module.exports.createDieuTraBHLK = async (req, res) => {
    const { matinh } = req.params;
    const ListHuyen = await HuyenModel.getByProvince(matinh)
    const ListXaTheoHuyen = [];
    for (const huyen of ListHuyen) {
        const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);
        ListXaTheoHuyen.push({ huyen: huyen.ma_huyen, dsXa });
    }
    res.render("admin/pages/dieu-tra-create", {
        pageTitle: "Tạo Dữ liệu",
        matinh,
        ListHuyen,
        ListXaTheoHuyen
    });
}

module.exports.createDieuTraBHLKPost = async (req, res) => {
    try {
        const { matinh, huyen, xa, sosau, socay, dia_chi_cu_the } = req.body;
        const dtra_date = new Date();
        const user_id = req.accout?.id || 1;
        const so_sau_non = parseInt(sosau) || 0;
        const so_cay = parseInt(socay) || 0;

        const newDieuTra = await DieuTraModel.create({
            ma_tinh: matinh,
            ma_huyen: huyen,
            ma_xa: xa,
            so_sau_non,
            so_cay,
            dtra_date,
            user_id,
            dia_chi_cu_the: dia_chi_cu_the || ""
        });
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Tạo dữ liệu điều tra")
        }

        req.flash("success", "Tạo mới thành công");
        res.json({ code: "success", data: newDieuTra });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
}

module.exports.editDieuTraBHLK = async (req, res) => {
    try {
        const { matinh, id } = req.params;

        // 1. Lấy bản ghi điều tra theo id
        const dieutra = await DieuTraModel.getById(id);
        if (!dieutra) {
            req.flash("error", "Không tìm thấy bản ghi!");
            return res.redirect(`/${pathAdmin}/benhhailakeo/dieutraBHLK/${matinh}/list`);
        }

        // 2. Lấy tên huyện và xã để hiển thị
        const huyen = await HuyenModel.getById(dieutra.ma_huyen);
        dieutra.ten_huyen = huyen ? huyen.ten_huyen : "";

        const xa = await XaModel.getById(dieutra.ma_xa);
        dieutra.ten_xa = xa ? xa.ten_xa : "";

        console.log("dieutra.ma_xa:", dieutra.ma_xa);
        console.log("Xa:", xa);

        // 3. Lấy danh sách huyện và xã
        const ListHuyen = await HuyenModel.getByProvince(matinh);
        let ListXaTheoHuyen = [];
        for (const h of ListHuyen) {
            const dsXa = await XaModel.getByDistrict(h.ma_huyen);
            ListXaTheoHuyen.push({
                huyen: h.ma_huyen,
                dsXa: dsXa // Không lọc
            });
        }

        // 4. Render form edit
        res.render("admin/pages/dieu-tra-edit", {
            pageTitle: "Chỉnh sửa Dữ liệu điều tra",
            matinh,
            ListHuyen,
            ListXaTheoHuyen, // đây là list đã lọc
            dieutra
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
};


module.exports.editDieuTraBHLKPatch = async (req, res) => {

    const { id } = req.params;
    const { matinh, huyen, xa, sosau, socay, dia_chi_cu_the } = req.body;
    console.log("doanh nè")
    try {


        // 1. Lấy bản ghi hiện tại
        const dieutra = await DieuTraModel.getById(id);
        if (!dieutra) {
            return res.status(404).json({ code: "error", message: "Bản ghi không tồn tại!" });
        }

        // 2. Ép kiểu số
        const so_sau_non = parseInt(sosau) || 0;
        const so_cay = parseInt(socay) || 0;

        // 3. Update bản ghi (giữ nguyên user_id và dtra_date)
        const updatedDieuTra = await DieuTraModel.update(id, {
            ma_tinh: matinh || dieutra.ma_tinh,
            ma_huyen: huyen || dieutra.ma_huyen,
            ma_xa: xa || dieutra.ma_xa,
            so_sau_non,
            so_cay,
            dtra_date: dieutra.dtra_date,   // giữ nguyên ngày tạo
            user_id: dieutra.user_id,       // giữ nguyên user_id
            dia_chi_cu_the: dia_chi_cu_the || dieutra.dia_chi_cu_the
        });
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Sửa dữ liệu điều tra")
        }

        // 4. Trả về JSON
        res.json({ code: "success", data: updatedDieuTra });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
};

module.exports.deleteDieuTraBHLKPatch = async (req, res) => {

    console.log("Chạy vào đây")
    try {
        const { id } = req.params;

        const updatedDieuTra = await DieuTraModel.softDelete(id);

        if (!updatedDieuTra) {
            return res.status(404).json({ code: "error", message: "Bản ghi không tồn tại!" });
        }
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Xóa dữ liệu điều cha")
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

// ===================== MAP =====================
module.exports.listMapBHLK = async (req, res) => {
    const { matinh } = req.params;
    let mapList = []
    try { mapList = await uploadMapModel.getAll(matinh) } catch (err) { console.error(err); res.status(500).json({ code: "error", message: "Lỗi server!" }); }
    res.render("admin/pages/map-list", { pageTitle: "Danh sách bản đồ", mapList, matinh });
}

module.exports.createMapBHLK = async (req, res) => {
    const { matinh } = req.params;
    res.render("admin/pages/map-create", { pageTitle: "Tạo bản đồ", matinh });
}

module.exports.createPostMapBHLK = async (req, res) => {
    try {
        const { matinh } = req.params;
        const { thongtin, map, mota } = req.body;
        const file = req.file ? req.file.path : null;

        const newMap = await uploadMapModel.create({ thongtin, loaibando: map, file, mota, ma_tinh: matinh });
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Tạo map ")
        }

        return res.json({ code: "success", message: "Thêm dữ liệu thành công", data: newMap });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: "error", message: "Lỗi server: " + err.message });
    }
}

module.exports.editMapBHLK = async (req, res) => {
    const { matinh, id } = req.params
    let dataMap;
    try { dataMap = await uploadMapModel.findById(id) } catch (err) { console.error(err); return res.status(500).json({ code: "error", message: "Lỗi server: " + err.message }); }

    res.render("admin/pages/map-edit", { pageTitle: "Sửa bản đồ", matinh, dataMap });
}

module.exports.editPatchMapBHLK = async (req, res) => {
    try {
        const { id } = req.params;
        const { thongtin, map, mota, file } = req.body;
        const updatedFields = { thongtin, loaibando: map, mota, file: req.file ? req.file.path : file };
        const updatedMap = await uploadMapModel.updateById(id, updatedFields);
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Sửa dữ liệu bản đồ")
        }

        if (!updatedMap) return res.status(404).json({ code: "error", message: "Không tìm thấy bản ghi để cập nhật" });
        return res.json({ code: "success", message: "Cập nhật dữ liệu thành công", data: updatedMap });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: "error", message: "Lỗi server: " + err.message });
    }
}

module.exports.deleteMapBHLK = async (req, res) => {


    try {

        const { id } = req.params;
        const success = await uploadMapModel.deleteById(id);
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Xóa dữ liệu bản đồ")
        }

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