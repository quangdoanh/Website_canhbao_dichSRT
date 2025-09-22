const moment = require("moment");
const WeatherModel = require("../../models/weather.model");

module.exports.list = async (req, res) => {
  try {
    const limit = 20; // số bản ghi mỗi trang
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // Tổng số bản ghi
    const totalRecords = await WeatherModel.countAll();
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // Lấy danh sách phân trang
    const dataList = await WeatherModel.getAllWithPagination(limit, offset);

    // Format ngày ngay_cap_nhat
    for (const item of dataList) {
      item.ngay_cap_nhat = item.ngay_cap_nhat
        ? moment(item.ngay_cap_nhat).format("DD/MM/YYYY")
        : null;
    }
    res.render("admin/pages/weather-data-list", {
      pageTitle: "Dữ liệu thời tiết",
      dataList: dataList,
      pagination: { page, totalPages, totalRecords },
      limit: limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.viewDetail =async (req,res) => {
    const {id} = req.params;
    console.log(id)
    const dataDetail = await WeatherModel.findById(parseInt(id));
    dataDetail.ngay_cap_nhatFomat =  moment(dataDetail.ngay_cap_nhat).format("DD/MM/YYYY")
    console.log(dataDetail);
    res.render("admin/pages/weather-data-detail",{
        pageTitle:"Chi tiết dữ liệu thời tiết",
        dataDetail:dataDetail
    })
}