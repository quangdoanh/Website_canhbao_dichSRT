const HaTinhModel = require(`../../models/hatinh.model`)

module.exports.homeSavePolygon = async (req, res) => {

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
    res.render('client/pages/index', {
        pageTitle: "Trang Chủ"
    });
}