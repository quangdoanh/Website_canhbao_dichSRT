
const SauRomThongModel = require('../../models/sau_rom_thong.model');
const SauHaiKeoModel = require('../../models/sau_hai_lakeo.model');
const BenhHaiKeoModel = require('../../models/benhhaikeo.model');
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
const TinhModel = require("../../models/tinh.model");
const DieuTraModel = require('../../models/dieutra.model');
const Log = require('../../helpers/loguser.helper')
const moment = require("moment");
const uploadMapModel = require('../../models/upload_map.model');

/*================
        SRT
==================*/
module.exports.list = async (req, res) => {

    try {


        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []

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

        if (effect == "defor") {
            TotalDuLieu = await SauRomThongModel.getAll_Defore();
            data = await SauRomThongModel.getAll_Defore_Condition(skip, limit);
        } else {
            TotalDuLieu = await SauRomThongModel.getAll_Degrad();
            data = await SauRomThongModel.getAll_Degrad_Condition(skip, limit);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))

        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let ma_tinh = null, ma_huyen = null, ma_xa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();

        if (req.query.tinh) {
            ma_tinh = Number(req.query.tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(req.query.tinh);
        }
        if (req.query.huyen) {
            ma_huyen = Number(req.query.huyen);
            ListXa_Condition = await XaModel.getByDistrict(ma_huyen)
        }




        res.render("admin/pages/dichbenh-nang-list", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            loaidich: "srt",
            effect: effect,
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition

        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }


}

module.exports.listStatusPending = async (req, res) => {

    try {
        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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


        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null



        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        console.log(req.query.startDate)


        if (effect == "defor") {
            TotalDuLieu = await SauRomThongModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauRomThongModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }





        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))

        console.log("du liệu excell:", data)

        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "srt",
            effect: effect,
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmed = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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
        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)



        if (effect == "defor") {
            TotalDuLieu = await SauRomThongModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauRomThongModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "srt",
            effect: effect,
            bando: "Sauromthong_6tinh",
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status = 0 hoặc 1

        console.log(id, status)

        const updated = await SauRomThongModel.updateStatus(parseInt(id), parseInt(status));
        if (!updated) {
            return res.json({ code: "error", message: "Không tìm thấy bản ghi!" });
        }
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát srt")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi cập nhật trạng thái",
        });
    }
}

module.exports.changeMultilStatus = async (req, res) => {
    try {
        const { option, ids } = req.body; // ids = [1,2,3]

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({ code: "error", message: "Chưa chọn bản ghi nào!" });
        }

        switch (option) {
            case "0": // Ẩn / Chưa xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 0);
                break;
            case "1": // Hiện / Đã xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 1);
                break;
            default:
                return res.json({ code: "error", message: "Tùy chọn không hợp lệ!" });
        }

        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát srt")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi xử lý nhiều bản ghi!",
        });
    }
}
module.exports.Detail = async (req, res) => {
    const { id } = req.params;
    const effect = req.params.effect


    console.log(id)
    const dataDetail = await SauRomThongModel.findById_Defor_Degrad(parseInt(id));
    dataDetail.acqui_dateFormat = moment(dataDetail.acqui_date).format("DD/MM/YYYY")
    console.log(dataDetail);

    console.log(req.originalUrl)
    const url = req.originalUrl.split('?')[1] || '';
    console.log(url)
    res.render("admin/pages/dichbenh-detail", {
        pageTitle: "Chi tiết dữ liệu mất rừng",
        dataDetail: dataDetail,
        url,
        effect: effect,
        loaidich: "srt",



    })
}

/*================
        SHk
==================*/

module.exports.listSHK = async (req, res) => {

    try {


        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []

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

        if (effect == "defor") {
            TotalDuLieu = await SauHaiKeoModel.getAll_Defore();
            data = await SauHaiKeoModel.getAll_Defore_Condition(skip, limit);
        } else {
            TotalDuLieu = await SauHaiKeoModel.getAll_Degrad();
            data = await SauHaiKeoModel.getAll_Degrad_Condition(skip, limit);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-nang-list", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            loaidich: "shk",
            effect: effect

        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }


}

module.exports.listStatusPendingSHK = async (req, res) => {

    try {

        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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


        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        if (effect == "defor") {
            TotalDuLieu = await SauHaiKeoModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauHaiKeoModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))



        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "shk",
            effect: effect,
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmedSHK = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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

        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        if (effect == "defor") {
            TotalDuLieu = await SauHaiKeoModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, maxa);
        } else {
            TotalDuLieu = await SauHaiKeoModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, maxa);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "shk",
            effect: effect,
            bando: "Sauhailakeo_5tinh",
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}

module.exports.changeStatusSHK = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status = 0 hoặc 1

        const updated = await SauHaiKeoModel.updateStatus(parseInt(id), parseInt(status));
        if (!updated) {
            return res.json({ code: "error", message: "Không tìm thấy bản ghi!" });
        }
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát shk")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi cập nhật trạng thái",
        });
    }
}

module.exports.changeMultilStatusSHK = async (req, res) => {
    try {
        const { option, ids } = req.body; // ids = [1,2,3]

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({ code: "error", message: "Chưa chọn bản ghi nào!" });
        }

        switch (option) {
            case "0": // Ẩn / Chưa xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 0);
                break;
            case "1": // Hiện / Đã xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 1);
                break;
            default:
                return res.json({ code: "error", message: "Tùy chọn không hợp lệ!" });
        }

        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát shk")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi xử lý nhiều bản ghi!",
        });
    }
}
module.exports.DetailSHK = async (req, res) => {
    const { id } = req.params;
    const effect = req.params.effect


    console.log(id)
    const dataDetail = await SauHaiKeoModel.findById_Defor_Degrad(parseInt(id));
    dataDetail.acqui_dateFormat = moment(dataDetail.acqui_date).format("DD/MM/YYYY")
    console.log(dataDetail);

    console.log(req.originalUrl)
    const url = req.originalUrl.split('?')[1] || '';
    console.log(url)
    res.render("admin/pages/dichbenh-detail", {
        pageTitle: "Chi tiết dữ liệu mất rừng",
        dataDetail: dataDetail,
        url,
        effect: effect,
        loaidich: "shk",

    })
}

/*================
        BHk
==================*/

module.exports.listBHK = async (req, res) => {

    try {


        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []

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

        console.log("nef", effect)

        if (effect == "defor") {
            console.log("chafjy vao dau")
            TotalDuLieu = await BenhHaiKeoModel.getAll_Defore();
            data = await BenhHaiKeoModel.getAll_Defore_Condition(skip, limit);
        } else {
            console.log("chafjy degrad")
            TotalDuLieu = await BenhHaiKeoModel.getAll_Degrad();
            data = await BenhHaiKeoModel.getAll_Degrad_Condition(skip, limit);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-nang-list", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            loaidich: "bhk",
            effect: effect

        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }


}

module.exports.listStatusPendingBHK = async (req, res) => {

    try {

        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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

        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        if (effect == "defor") {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "bhk",
            effect: effect,
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmedBHK = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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

        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        if (effect == "defor") {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.render("admin/pages/dichbenh-status", {
            pageTitle: "Danh sách dịch nặng",
            pagination: pagination,
            listDulieu: listDulieu,
            statusPage,
            loaidich: "bhk",
            effect: effect,
            bando: "Benhhaikeo_8tinh",
            ListHuyen: ListHuyen,
            ListTinh: ListTinh,
            ListXa: ListXa,
            ListHuyen_Condition: ListHuyen_Condition,
            ListXa_Condition: ListXa_Condition
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}

module.exports.changeStatusBHK = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status = 0 hoặc 1

        const updated = await BenhHaiKeoModel.updateStatus(parseInt(id), parseInt(status));
        if (!updated) {
            return res.json({ code: "error", message: "Không tìm thấy bản ghi!" });
        }
        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát bhk")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi cập nhật trạng thái",
        });
    }
}

module.exports.changeMultilStatusBHK = async (req, res) => {
    try {
        const { option, ids } = req.body; // ids = [1,2,3]

        console.log(option, ids)

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({ code: "error", message: "Chưa chọn bản ghi nào!" });
        }

        switch (option) {
            case "0": // Ẩn / Chưa xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 0);
                break;
            case "1": // Hiện / Đã xác nhận
                await SauRomThongModel.updateStatusMultiByIds(ids, 1);
                break;
            default:
                return res.json({ code: "error", message: "Tùy chọn không hợp lệ!" });
        }

        const user = req.account?.email;
        if (user) {
            Log.logUser(user, req.originalUrl, req.method, "Đổi trạng thái giám sát bhk")
        }

        req.flash("success", "Đổi trạng thái thành công!");
        res.json({ code: "success" });
    } catch (err) {
        console.error(err);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi xử lý nhiều bản ghi!",
        });
    }
}
module.exports.DetailBHK = async (req, res) => {
    const { id } = req.params;
    const effect = req.params.effect


    console.log(id)
    const dataDetail = await BenhHaiKeoModel.findById_Defor_Degrad(parseInt(id));
    dataDetail.acqui_dateFormat = moment(dataDetail.acqui_date).format("DD/MM/YYYY")
    console.log(dataDetail);

    console.log(req.originalUrl)
    const url = req.originalUrl.split('?')[1] || '';
    console.log(url)
    res.render("admin/pages/dichbenh-detail", {
        pageTitle: "Chi tiết dữ liệu mất rừng",
        dataDetail: dataDetail,
        url,
        effect: effect,
        loaidich: "bhk",



    })
}


/* =========== Mobile ============ */

module.exports.listStatusPendingMobile = async (req, res) => {

    try {
        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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


        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null



        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        console.log(req.query.startDate)


        if (effect == "defor") {
            TotalDuLieu = await SauRomThongModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauRomThongModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }





        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))

        console.log("du liệu excell:", data)

        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmedMobile = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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
        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)



        if (effect == "defor") {
            TotalDuLieu = await SauRomThongModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauRomThongModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauRomThongModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
module.exports.listStatusPendingSHKMobile = async (req, res) => {

    try {
        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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


        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null



        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        console.log(req.query.startDate)


        if (effect == "defor") {
            TotalDuLieu = await SauHaiKeoModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauHaiKeoModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }





        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))

        console.log("du liệu excell:", data)

        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmedSHKMobile = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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
        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)



        if (effect == "defor") {
            TotalDuLieu = await SauHaiKeoModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await SauHaiKeoModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await SauHaiKeoModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
module.exports.listStatusPendingBHKMobile = async (req, res) => {

    try {
        const effect = req.params.effect
        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 0;

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


        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null



        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)

        console.log(req.query.startDate)


        if (effect == "defor") {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Defore(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Defore_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Degrad(0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Degrad_Condition(skip, limit, 0, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }


        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }





        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))

        console.log("du liệu excell:", data)

        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }

}
module.exports.listStatusConfirmedBHKMobile = async (req, res) => {

    try {
        const effect = req.params.effect

        let listDulieu = []
        let TotalDuLieu = [], data = []
        let statusPage = 1;

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
        // TỈNH - HUYỆN - XÃ
        let ListTinh = [], ListHuyen = [], ListXa = [];
        let ListHuyen_Condition = [], ListXa_Condition = [];
        let matinh = null, mahuyen = null, maxa = null

        ListTinh = await TinhModel.getAll();
        ListHuyen = await HuyenModel.getAll();
        ListXa = await XaModel.getAll();


        if (req.query.ma_tinh) {
            matinh = Number(req.query.ma_tinh);
            ListHuyen_Condition = await HuyenModel.getByMaTinh(matinh);
        }
        if (req.query.ma_huyen) {
            mahuyen = Number(req.query.ma_huyen);
            ListXa_Condition = await XaModel.getByDistrict(mahuyen)
        }


        console.log("tỉnh ", ListTinh)
        console.log("Huyen", ListHuyen_Condition)
        console.log("Xa", ListXa_Condition)



        if (effect == "defor") {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Defore(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Defore_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        } else {
            TotalDuLieu = await BenhHaiKeoModel.getAll_Degrad(1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
            data = await BenhHaiKeoModel.getAll_Degrad_Condition(skip, limit, 1, matinh, mahuyen, req.query.ma_xa, req.query.startDate, req.query.endDate);
        }




        console.log("Tổng dữ liệu:", TotalDuLieu.length)

        const totalPage = Math.ceil(TotalDuLieu.length / limit);

        let pagination = {
            skip: skip,
            TotalDuLieu: TotalDuLieu,
            totalPage: totalPage
        }


        //console.log("Tổng dữ liệu:", pagination)

        listDulieu = data.map(item => ({
            id: item.id,
            // diadiem_dieutra: item.dieutra || "",
            tinh: item.ten_tinh,
            huyen: item.ten_huyen,
            xa: item.ten_xa,
            tieukhu: item.tk,
            khoanh: item.khoanh,
            lo: item.lo,
            dtich: item.dtich,
            area_ha: item.area_ha,
            nochang_ha: item.nochang_ha,
            improve_ha: item.improv_ha,
            sensor: item.sensor,
            impact_ha: item.defor_ha !== null ? item.defor_ha : item.degrad_ha,
            loairung: item.ldlr,
            churung: item.chu_rung,
            status: item.status,
            ngayPH: moment(item.acqui_date).format("DD/MM/YYYY")
        }))


        res.json({
            code: "success",
            message: "Lấy dữ liệu thành công",
            listDulieu: listDulieu
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}