const Sauromthong_6tinhModel = require(`../../models/sau_rom_thong.model`)
const Log = require(`../../helpers/loguser.helper`);
const Sauhailakeo_5tinhModel = require("../../models/sau_hai_lakeo.model");
const Benhhai_lakeoModel = require("../../models/benhhaikeo.model");
const TinhModel = require("../../models/tinh.model");
const HuyenModel = require("../../models/huyen.model");
const XaModel = require("../../models/xa.model");
const moment = require("moment/moment")
module.exports.mapCanhBao = async (req, res) => {


    let dataList = [];

    let mucdo = req.query.mucdo;


    dataList = await Sauromthong_6tinhModel.findTop20_Canh_Bao(mucdo);

    console.log("Dữ liệu:", dataList)

    for (const item of dataList) {
        item.xa = item.xa.split(" ").slice(1).join(" ");
        item.day = moment(item.acqui_date).format("DD/MM/YYYY");

    }




    res.render('client/pages/bando-canhbao', {
        pageTitle: "Bản đồ cảnh báo",
        dataList: dataList

    });
}