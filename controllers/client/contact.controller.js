const ContactModel = require("../../models/contact.model");
module.exports.contactList = (req, res) => {
    res.render('client/pages/contact', {
        pageTitle: "Liên hệ"
    });
}
// Tạo mới contact
module.exports.contactCreatePost = async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;

    if (!full_name || !email || !message) {
      return res.status(400).json({
        code: "error",
        message: "Vui lòng nhập đầy đủ họ tên, email và nội dung!",
      });
    }

    await ContactModel.addNew({
      full_name,
      email,
      phone,
      message,
    });

    res.json({
      code: "success",
      message: "Gửi liên hệ thành công"
    });
  } catch (err) {
    console.error("Lỗi khi tạo contact:", err);
    res.status(500).json({
      code: "error",
      message: "Có lỗi xảy ra khi gửi liên hệ",
    });
  }
};