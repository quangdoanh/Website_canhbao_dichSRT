const DegradModel = require("../../models/degrad.model");
const moment = require("moment");

module.exports.listPending = async (req, res) => {
  try {
    const limit = 20;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // Tổng số bản ghi status = 0
    const totalRecords = await DegradModel.countByStatus(0);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // Lấy danh sách phân trang
    const degradList = await DegradModel.getByStatusWithPagination(
      0,
      limit,
      offset
    );

    degradList.forEach((item) => {
      item.acqui_dateFormat = item.acqui_date
        ? moment(item.acqui_date).format("DD/MM/YYYY")
        : null;
    });

    res.render("admin/pages/degrad-list", {
      pageTitle: "Dữ liệu mất rừng (Chưa xác nhận)",
      degradList,
      pagination: { page, totalPages, totalRecords },
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.listConfirmed = async (req, res) => {
  try {
    const limit = 20;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const totalRecords = await DegradModel.countByStatus(1);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    const degradList = await DegradModel.getByStatusWithPagination(
      1,
      limit,
      offset
    );

    degradList.forEach((item) => {
      item.acqui_dateFormat = item.acqui_date
        ? moment(item.acqui_date).format("DD/MM/YYYY")
        : null;
    });

    res.render("admin/pages/degrad-list", {
      pageTitle: "Dữ liệu mất rừng (Đã xác nhận)",
      degradList,
      pagination: { page, totalPages, totalRecords },
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

module.exports.degradDetail =async (req,res) => {
    const {id} = req.params;
    console.log(id)
    const dataDetail = await DegradModel.findById(parseInt(id));
    dataDetail.acqui_dateFormat =  moment(dataDetail.acqui_date).format("DD/MM/YYYY")
    console.log(dataDetail);
    res.render("admin/pages/degrad-detail",{
        pageTitle:"Chi tiết dữ liệu mất rừng",
        dataDetail:dataDetail
    })
}
// Cập nhật trạng thái cho 1 bản ghi
module.exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status = 0 hoặc 1

    const updated = await DegradModel.updateStatus(parseInt(id), parseInt(status));
    if (!updated) {
      return res.json({ code: "error", message: "Không tìm thấy bản ghi!" });
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
};

//  Cập nhật trạng thái cho nhiều bản ghi
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body; // ids = [1,2,3]

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json({ code: "error", message: "Chưa chọn bản ghi nào!" });
    }

    switch (option) {
      case "0": // Ẩn / Chưa xác nhận
        await DegradModel.updateStatusMultiByIds(ids, 0);
        break;
      case "1": // Hiện / Đã xác nhận
        await DegradModel.updateStatusMultiByIds(ids, 1);
        break;
      default:
        return res.json({ code: "error", message: "Tùy chọn không hợp lệ!" });
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
};