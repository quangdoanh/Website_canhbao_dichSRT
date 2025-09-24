const ContactModel = require("../../models/contact.model");
const moment = require("moment");
function getTopicLabel(topic) {
  switch (topic) {
    case "sau-rom-thong":
      return "Sâu róm Thông";
    case "sau-hai-lakeo":
      return "Sâu hại lá Keo";
    case "benh-hai-lakeo":
      return "Bệnh hại lá Keo";
    default:
      return "Không xác định";
  }
}
module.exports.list = async (req, res) => {
  try {
    const limit = 20; // số bản ghi trên mỗi trang
    let page = parseInt(req.query.page) || 1; // lấy page từ URL
    if (page < 1) page = 1;

    // Bước 1: đếm tổng số bản ghi
    const totalRecords = await ContactModel.countAll();
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    // Bước 2: tính offset
    const offset = (page - 1) * limit;

    // Bước 3: lấy danh sách phân trang
    const contactList = await ContactModel.getAllWithPagination({
      limit,
      offset
    });

    // Bước 4: format ngày + nhãn topic
    contactList.forEach((item) => {
      item.createdAtFormat = moment(item.created_at).format("DD/MM/YYYY");
      item.topicLabel = getTopicLabel(item.topic);
    });

    // Bước 5: render ra view
    res.render("admin/pages/contact-list", {
      pageTitle: "Danh sách liên hệ",
      contactList,
      pagination: { page, totalPages, totalRecords },
      limit
    });
  } catch (error) {
    console.error(error);
    res.json({ code: "error", message: "Lỗi server" });
  }
};


module.exports.contactAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const contactDetail = await ContactModel.getById(parseInt(id));
    contactDetail.topicLabel = getTopicLabel(contactDetail.topic);
    res.render("admin/pages/contact-answer", {
      pageTitle: "Phản hồi liên hệ",
      contactDetail: contactDetail
    });
  } catch (error) {
    console.error(error);
    res.json({ code: "error", message: "Lỗi server" });
  }
};
module.exports.contactAnswerPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
       res.json({
        code: "error",
        message: "Vui lòng nhập phản hồi!",
      });
      return;
    }

    // status = 1: đã trả lời
    const updated = await ContactModel.answerAndUpdateStatus(id, {
      answer,
      status: 1,
    });

    if (!updated) {
       res.json({
        code: "error",
        message: "Không tìm thấy liên hệ cần cập nhật!",
      });
      return;
    }

    req.flash("success", "Phản hồi đã được lưu!");
    return res.json({
      code: "success",
      message: "Phản hồi đã được lưu!",
    });
  } catch (err) {
    console.error("Lỗi cập nhật trả lời:", err);
    res.json({ code: "error", message: "Lỗi server" });
  }
};
//ẩn hiện câu hỏi và câu trả lời
module.exports.togglePublic = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body; // true hoặc false
    console.log(isPublic);

    const updated = await ContactModel.updatePublic(id, isPublic);

    if (!updated) {
      return res.json({
        code: "error",
        message: "Không tìm thấy liên hệ để cập nhật!",
      });
    }

    return res.json({
      code: "success",
      message: `Liên hệ đã được ${isPublic ? "hiển thị" : "ẩn"}!`,
    });
  } catch (err) {
    console.error("Lỗi cập nhật is_public:", err);
    res.json({ code: "error", message: "Lỗi server" });
  }
};
//end ẩn hiện câu hỏi và câu trả lời


// changeMulti
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, option } = req.body; // isPublic từ client về là "true"/"false"
    console.log("raw isPublic:", option);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json({ code: "error", message: "Danh sách ID không hợp lệ!" });
    }

    // ép kiểu string -> boolean
    const isPublicBool = (option === "true" || option === true);

    const updated = await ContactModel.updatePublicMulti(ids, isPublicBool);
    req.flash("success",`Đã cập nhật ${updated.length} bản ghi thành công!` )
    return res.json({
      code: "success",
      message: `Đã cập nhật ${updated.length} bản ghi thành công!`,
      data: updated,
    });
  } catch (err) {
    console.error("Lỗi changeMulti:", err);
    res.json({ code: "error", message: "Lỗi server!" });
  }
};

//end changeMulti