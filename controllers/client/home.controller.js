const HaTinhModel = require(`../../models/hatinh.model`)
const Sauromthong_6tinhModel = require(`../../models/sau_rom_thong.model`)
const Log = require(`../../helpers/loguser.helper`);
const Sauhailakeo_5tinhModel = require("../../models/sau_hai_lakeo.model");
const Benhhai_lakeoModel = require("../../models/benhhaikeo.model");
const TinhModel = require("../../models/tinh.model");
const HuyenModel = require("../../models/huyen.model");
const XaModel = require("../../models/xa.model");

module.exports.homeSavePolygon = async (req, res) => {
    if (req.account == "guest") {
        res.json({
            success: false,
            message: "Bạn cần đăng nhập để lưu polygon"
        });
        return
    }

    // Lưu log
    // const user = req.account?.email;
    // if (user) {
    //     Log.logUser(user, req.originalUrl, req.method, "Lưu Polygon")
    // }
    // end

    try {
        const { geometries } = req.body;

        console.log(" Nhận geometry từ FE:", geometries);

        if (!geometries || geometries.length === 0) {
            return res.json({ success: false, message: "Không có polygon nào để lưu" });
        }

        const insertedIds = [];
        const failed = [];

        for (let [index, geom] of geometries.entries()) {
            try {
                const pk = await HaTinhModel.insert(geom);
                insertedIds.push(pk);
            } catch (err) {
                console.error(` Lỗi khi lưu polygon index ${index}:`, err.message);
                failed.push({ index, error: err.message });
            }
        }

        res.json({
            success: true,
            inserted: insertedIds,
            failed: failed
        });

    } catch (err) {
        console.error(" Lỗi không mong đợi:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}
module.exports.homeDeletePolygon = async (req, res) => {
    if (req.account == "guest") {
        res.json({
            success: false,
            message: "Bạn cần đăng nhập để xóa polygon"
        });
    }
    // Lưu log
    // const user = req.account?.email;
    // if (user) {
    //     Log.logUser(user, req.originalUrl, req.method, "Xóa Polygon")
    // }
    // end
    try {
        const id = req.params.id;
        const success = await HaTinhModel.delete(id);

        if (success) {
            res.json({
                code: "success",
                message: "Xóa thành công"
            })
        }


    } catch (err) {
        console.error(" Lỗi khi xóa polygon:", err);
    }
}
module.exports.home = async (req, res) => {

    // const user = req.account?.email;
    // if (user) {
    //     Log.logUser(user, req.originalUrl, req.method, "Truy cập trang chủ")
    // }
    let dataList = [];
    let ListTinh = [], ListHuyen = [], ListXa = [];

    let matinh = null;
    let mahuyen = null;


    ListTinh = await TinhModel.getAll();

    console.log("tỉnh ", ListTinh)
    if (req.query.tinh) {
        matinh = Number(req.query.tinh);
        ListHuyen = await HuyenModel.getByMaTinh(req.query.tinh);
    }
    if (req.query.huyen) {
        mahuyen = Number(req.query.huyen);
    }
    ListXa = await XaModel.getAll();

    const dataMap = req.query.bando;
    if (dataMap == "Sauhailakeo_5tinh") {
        dataList = await Sauhailakeo_5tinhModel.findTop20ByDienTich(matinh, mahuyen)

    } else if (dataMap == "Sauromthong_6tinh") {
        console.log(matinh, mahuyen)
        dataList = await Sauromthong_6tinhModel.findTop20ByDienTich(matinh, mahuyen)

    } else {
        dataList = await Benhhai_lakeoModel.findTop20ByDienTich(matinh, mahuyen)
    }
    //console.log(sauromthongList)

    res.render('client/pages/index', {
        pageTitle: "Trang Chủ",
        dataList: dataList,
        ListTinh: ListTinh,
        ListXa: ListXa,
        ListHuyen: ListHuyen
    });
}