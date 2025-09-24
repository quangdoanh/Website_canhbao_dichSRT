const ContactModel = require("../../models/contact.model");

// Map slug -> tên hiển thị
const faqTopics = {
  "sau-rom-thong": "Sâu róm Thông",
  "sau-hai-lakeo": "Sâu hại lá Keo",
  "benh-hai-lakeo": "Bệnh hại lá Keo",
};

module.exports.faqByTopic = async (req, res) => {
  try {
    const topic = req.params.topic;

    if (!faqTopics[topic]) {
      return res.status(404).send("Chủ đề không tồn tại");
    }

    // --- Phân trang ---
    const limit = 10; // số câu hỏi trên 1 trang
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const totalRecords = await ContactModel.countPublic(topic);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    const faqList = await ContactModel.getPublicWithPagination(topic, limit, offset);

    res.render("client/pages/faq", {
      faqList,
      topicName: faqTopics[topic],
      pagination: { page, totalPages, totalRecords },
      limit
    });
  } catch (error) {
    console.error("Lỗi FAQ:", error);
    res.status(500).send("Lỗi server");
  }
};