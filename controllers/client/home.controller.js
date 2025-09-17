const HaTinhModel = require(`../../models/hatinh.model`)
const Log = require(`../../helpers/loguser.helper`)

module.exports.homeSavePolygon = async (req, res) => {
    if (req.account == "guest") {
        res.json({
            success: false,
            message: "Bạn cần đăng nhập để lưu polygon"
        });
        return
    }

    // Lưu log
    const user = req.account?.email;
    if (user) {
        Log.logUser(user, req.originalUrl, req.method, "Lưu Polygon")
    }
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
    const user = req.account?.email;
    if (user) {
        Log.logUser(user, req.originalUrl, req.method, "Xóa Polygon")
    }
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
module.exports.home = (req, res) => {

    const user = req.account?.email;
    if (user) {
        Log.logUser(user, req.originalUrl, req.method, "Truy cập trang chủ")
    }

    res.render('client/pages/index', {
        pageTitle: "Trang Chủ"
    });
}