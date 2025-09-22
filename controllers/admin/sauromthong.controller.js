const SauRomThongModel = require('../../models/sau_rom_thong.model');
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const DieuTraModel = require('../../models/dieutra.model');
const moment = require("moment");
const uploadMapModel = require('../../models/upload_map.model');

module.exports.listDulieuSRT = async (req, res) => {
    const { matinh } = req.params; // lấy từ URL
    let listDulieuSRT = []
    try {

        // Phân trang 
        const limit = 15;
        let page = 1;

        if (req.query.page) {
            const pageCurrent = parseInt(req.query.page)
            if (pageCurrent > 0) {
                page = pageCurrent
            }
        }
        const skip = (page - 1) * limit

        const TotalDuLieuSRT = await SauRomThongModel.getAllByMaTinh(matinh);

        console.log("Tổng dữ liệu:", TotalDuLieuSRT.length)

        const totalPage = Math.ceil(TotalDuLieuSRT.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieuSRT: TotalDuLieuSRT,
            totalPage: totalPage
        }

        const data = await SauRomThongModel.findByMaTinh(matinh, skip, limit);

        //console.log("Tổng dữ liệu:", pagination)

        listDulieuSRT = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
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
        console.log("Tổng dữ liệu:", listDulieuSRT.length)
        res.render("admin/pages/dulieuSRT-list", {
            pageTitle: "Dữ liệu SRT",
            listDulieuSRT: listDulieuSRT,
            pagination: pagination,
            matinh: matinh
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }



}
module.exports.editDulieuSRT = async (req, res) => {

    const { matinh, id } = req.params;
    let dataSRT
    try {
        dataSRT = await SauRomThongModel.findById(id);

        // hiện tại sauromthongmodel chưa có địa điểm điều tra
        //dataSRT.diadiem_dieutra = ""

        // console.log("dataSRT", dataSRT)
    } catch (error) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }



    res.render("admin/pages/dulieuSRT-edit", {
        pageTitle: "Cập nhật Dữ liệu SRT",
        dataSRT: dataSRT,
        matinh: matinh


    });
}
module.exports.editPatchDulieuSRT = async (req, res) => {

    const { id } = req.params;
    console.log(req.body)
    try {

        if (req.body.phancap != '3') {
            console.log('khác 3')
            if (await SauRomThongModel.deletewebById(id) && await SauRomThongModel.updatePhanCapById(id, req.body.phancap)) {
                res.json({
                    code: "success",
                    message: "Sửa thành công"
                })
                console.log("srt da xoa:", await SauRomThongModel.findById(id))
            } else {
                res.json({
                    code: "error",
                    message: "Sửa thất bại"
                })
            }

        }

    } catch (error) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }


}
module.exports.createDulieuSRT = async (req, res) => {
    const { matinh } = req.params;
    let ListXaTheoHuyen = [];
    let ListHuyen = []
    try {


        ListHuyen = await HuyenModel.getByProvince(matinh)
        console.log("huyện", ListHuyen)


        for (const huyen of ListHuyen) {
            // Lấy xã theo mã huyện
            const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);

            ListXaTheoHuyen.push({
                huyen: huyen.ma_huyen,
                dsXa: dsXa
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

    res.render("admin/pages/dulieuSRT-create", {
        pageTitle: "Tạo Dữ liệu SRT",
        ListHuyen: ListHuyen,
        ListXaTheoHuyen: ListXaTheoHuyen,
        matinh: matinh

    });
}

module.exports.listDieuTraSrt = async (req, res) => {
    const { matinh } = req.params;

    try {
        // 1. Lấy tất cả bản ghi dieu_tra
        const keyword = req.query.keyword || "";

        let dieutraList;
        if (keyword) {
            dieutraList = await DieuTraModel.search(keyword, matinh);
        } else {
            dieutraList = await DieuTraModel.getAllByMaTinh(matinh);
        };

        // 2. Lấy danh sách tỉnh, huyện theo tỉnh
        const listTinh = await TinhModel.getAll(); // {ma_tinh, ten_tinh}
        const listHuyen = await HuyenModel.getByProvince(matinh); // {ma_huyen, ten_huyen}

        // 3. Lấy danh sách xã theo từng huyện
        const listXaTheoHuyen = {};
        for (const huyen of listHuyen) {
            const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);
            listXaTheoHuyen[huyen.ma_huyen] = dsXa; // map: ma_huyen -> danh sách xã
        }

        // 4. Map tên tỉnh, huyện, xã và định dạng ngày
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
        // 5. Render Pug
        res.render("admin/pages/dieu-tra-list", {
            pageTitle: "Danh sách điều tra",
            matinh,
            dieutraList
        });

    } catch (err) {
        console.error("Lỗi khi lấy danh sách điều tra:", err);
        req.flash("error", "Có lỗi xảy ra khi lấy danh sách điều tra!");
    }
};

// api cho app
module.exports.appListDieuTraSrt = async (req, res) => {
    const { matinh } = req.params;

    try {
        // 1. Lấy tất cả bản ghi dieu_tra
        const keyword = req.query.keyword || "";

        let dieutraList;
        if (keyword) {
            dieutraList = await DieuTraModel.search(keyword);
        } else {
            dieutraList = await DieuTraModel.getAll();
        };

        // 2. Lấy danh sách tỉnh, huyện theo tỉnh
        const listTinh = await TinhModel.getAll(); // {ma_tinh, ten_tinh}
        const listHuyen = await HuyenModel.getByProvince(matinh); // {ma_huyen, ten_huyen}

        // 3. Lấy danh sách xã theo từng huyện
        const listXaTheoHuyen = {};
        for (const huyen of listHuyen) {
            const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);
            listXaTheoHuyen[huyen.ma_huyen] = dsXa; // map: ma_huyen -> danh sách xã
        }

        // 4. Map tên tỉnh, huyện, xã và định dạng ngày
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
        res.json({
            dieutraList: dieutraList
        })
    } catch (err) {
        console.error("Lỗi khi lấy danh sách điều tra:", err);
        req.flash("error", "Có lỗi xảy ra khi lấy danh sách điều tra!");
    }
};
//end api cho app
module.exports.createDieuTraSrt = async (req, res) => {
    const { matinh } = req.params;
    let ListHuyen = await HuyenModel.getByProvince(matinh)
    let ListXaTheoHuyen = [];

    for (const huyen of ListHuyen) {
        // Lấy xã theo mã huyện
        const dsXa = await XaModel.getByDistrict(huyen.ma_huyen);

        //     console.log(`Huyện: ${huyen.ten_huyen} (${huyen.ma_huyen})`);
        // console.log("Danh sách xã:", dsXa);

        ListXaTheoHuyen.push({
            huyen: huyen.ma_huyen,
            dsXa: dsXa
        });
    }

    res.render("admin/pages/dieu-tra-create", {
        pageTitle: "Tạo Dữ liệu ",
        matinh: matinh,
        ListHuyen: ListHuyen,
        ListXaTheoHuyen: ListXaTheoHuyen
    });
}

module.exports.createDieuTraSrtPost = async (req, res) => {
    try {
        const { matinh, huyen, xa, sosau, socay, dia_chi_cu_the, loai_cay, duong_kinh_tb } = req.body;
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
            ma_huyen: huyen,
            ma_xa: xa,
            so_sau_non,
            so_cay,
            dtra_date,
            user_id,
            dia_chi_cu_the: dia_chi_cu_the,
            loai_cay: loai_cay,
            duong_kinh_tb: duong_kinh_tb_num

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


module.exports.editDieuTraSrt = async (req, res) => {
    try {
        const { matinh, id } = req.params;

        // 1. Lấy bản ghi điều tra theo id
        const dieutra = await DieuTraModel.getById(id);
        if (!dieutra) {
            req.flash("error", "Không tìm thấy bản ghi!");
            return res.redirect(`/${pathAdmin}/sauromthong/dieutrasrt/${matinh}/list`);
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


module.exports.editDieuTraSrtPatch = async (req, res) => {

    const { id } = req.params;
    const { matinh, huyen, xa, sosau, socay, dia_chi_cu_the, loai_cay, duong_kinh_tb } = req.body;
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
            ma_huyen: huyen || dieutra.ma_huyen,
            ma_xa: xa || dieutra.ma_xa,
            so_sau_non,
            so_cay,
            dtra_date: dieutra.dtra_date,   // giữ nguyên ngày tạo
            user_id: dieutra.user_id,       // giữ nguyên user_id
            dia_chi_cu_the: dia_chi_cu_the || dieutra.dia_chi_cu_the,
            loai_cay: loai_cay,
            duong_kinh_tb: duong_kinh_tb_num
        });

        req.flash("success", "Cập nhật thành công")
        // 4. Trả về JSON
        res.json({ code: "success", data: updatedDieuTra });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: "error", message: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
};

module.exports.deleteDieuTraSrtPatch = async (req, res) => {

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

module.exports.listMapSrt = async (req, res) => {
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
module.exports.createMapSrt = async (req, res) => {
    const { matinh } = req.params;

    res.render("admin/pages/map-create", {
        pageTitle: " Tạo bản đồ",
        matinh: matinh
    });
}
module.exports.createPostMapSrt = async (req, res) => {
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

module.exports.editMapSrt = async (req, res) => {
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
module.exports.editPatchMapSrt = async (req, res) => {
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
module.exports.deleteMapSrt = async (req, res) => {


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