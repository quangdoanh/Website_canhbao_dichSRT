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

    // Kiểm tra topic có hợp lệ không
    if (!faqTopics[topic]) {
      return res.status(404).send("Chủ đề không tồn tại");
    }

    // Lấy danh sách câu hỏi theo topic
    const faqList = await ContactModel.getAll({ topic });

    res.render("client/pages/faq", {
      faqList,
      topicName: faqTopics[topic],
    });
  } catch (error) {
    console.error("Lỗi FAQ:", error);
    res.status(500).send("Lỗi server");
  }
};
