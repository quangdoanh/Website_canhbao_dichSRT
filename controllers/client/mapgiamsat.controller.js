const Sauromthong_6tinhModel = require(`../../models/sau_rom_thong.model`)
const Log = require(`../../helpers/loguser.helper`);
const Sauhailakeo_5tinhModel = require("../../models/sau_hai_lakeo.model");
const Benhhai_lakeoModel = require("../../models/benhhaikeo.model")
const TinhModel = require("../../models/tinh.model");
const HuyenModel = require("../../models/huyen.model");
const XaModel = require("../../models/xa.model");
const moment = require("moment/moment")

module.exports.mapGiamSat = async (req, res) => {

    let dataList = [];

    let mucdo = req.query.mucdo;

    let dataMap = req.query.bando


    if (dataMap == "Sauhailakeo_5tinh") {

        if (mucdo == "0") {

            dataList = await Sauhailakeo_5tinhModel.findTop20_Degrad_ByDienTich()
        } else {
            dataList = await Sauhailakeo_5tinhModel.findTop20_Defore_ByDienTich();
        }


    } else if (dataMap == "Sauromthong_6tinh") {

        if (mucdo == "0") {

            dataList = await Sauromthong_6tinhModel.findTop20_Degrad_ByDienTich()
        } else {
            dataList = await Sauromthong_6tinhModel.findTop20_Defore_ByDienTich();
        }

    } else {
        if (mucdo == "0") {

            dataList = await Benhhai_lakeoModel.findTop20_Degrad_ByDienTich()
        } else {
            dataList = await Benhhai_lakeoModel.findTop20_Defore_ByDienTich();
        }
    }



    console.log("Dữ liệu:", dataList)

    for (const item of dataList) {
        item.xa = item.xa.split(" ").slice(1).join(" ");
        item.day = moment(item.acqui_date).format("DD/MM/YYYY");

    }

    res.render('client/pages/bando-giamsat', {
        pageTitle: "Bản đồ giám sát",
        dataList: dataList
    });
}