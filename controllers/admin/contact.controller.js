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
    const contactList = await ContactModel.getAll();

    for (const item of contactList) {
      item.createdAtFormat = moment(item.created_at).format("DD/MM/YYYY");
    }
    console.log(contactList);
    res.render("admin/pages/contact-list", {
      pageTitle: "Danh sách liên hệ",
      contactList: contactList,
    });
  } catch (error) {
    console.error(error);
    res.json({ code: "error", message: "Lỗi server" });
    res.redirect(`/${pathAdmin}/contact/list`);
  }
};

module.exports.contactAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const contactDetail = await ContactModel.getById(parseInt(id));
    contactDetail.topicLabel = getTopicLabel(contactDetail.topic);
    console.log(contactDetail);
    res.render("admin/pages/contact-answer", {
      pageTitle: "Phản hồi liên hệ",
      contactDetail: contactDetail
    });
  } catch (error) {
    console.error(error);
    res.json({ code: "error", message: "Lỗi server" });
    res.redirect(`/${pathAdmin}/contact/list`);
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

    return res.json({
      code: "success",
      message: "Phản hồi đã được lưu!",
    });
  } catch (err) {
    console.error("Lỗi cập nhật trả lời:", err);
    res.json({ code: "error", message: "Lỗi server" });
    res.redirect(`/${pathAdmin}/contact/list`);
  }
};