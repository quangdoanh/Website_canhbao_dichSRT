const AboutModel = require("../../models/about.model");
const moment = require("moment");
module.exports.about = async(req, res) => {
     const aboutList = await AboutModel.getByStatus();
    for(const item of aboutList){
        item.createdAtFormat = moment(item.created_at).format("DD/MM/YYYY");
    }
    res.render('client/pages/about-us', {
        pageTitle: "Giới thiệu",
        aboutList:aboutList
    });
}