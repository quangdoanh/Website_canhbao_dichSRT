const SauRomThongModel = require('../../models/sau_rom_thong.model');
const HuyenModel = require('../../models/huyen.model');
const XaModel = require('../../models/xa.model')
module.exports.listDulieuSRT = async (req, res) => {
    const { matinh } = req.params; // lấy từ URL
    let listDulieuSRT = []
    try {

        const data = await SauRomThongModel.findByMaTinh(matinh);


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
        }));
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }


    res.render("admin/pages/dulieuSRT-list", {
        pageTitle: "Dữ liệu SRT",
        listDulieuSRT: listDulieuSRT,
        matinh: matinh
    });
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