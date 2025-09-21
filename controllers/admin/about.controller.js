const AboutModel = require("../../models/about.model");
const moment = require("moment");
module.exports.list = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const limit = 3; // số bản ghi/trang
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // Tổng số bản ghi
    const totalRecords = await AboutModel.countAllWithKeyword(keyword);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // Lấy danh sách phân trang
    const aboutList = await AboutModel.selectAllWithKeyword(limit, offset, keyword);

    // Format ngày tạo
    for (const item of aboutList) {
      item.createdAtFormat = moment(item.created_at).format("DD/MM/YYYY");
    }

    res.render("admin/pages/about-list", {
      pageTitle: "Danh sách bài giới thiệu",
      aboutList,
      pagination: { page, totalPages, totalRecords },
      keyword,
      limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/about-create", {
    pageTitle: "Thêm bài giới thiệu",
  });
};
module.exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    let avatar = null;

    if (req.file && req.file.path) {
      avatar = req.file.path;
    }

    const create_by = req.account?.id || null;

    await AboutModel.addNew({
      title,
      content,
      avatar,
      status: 1,
      create_by,
    });

    req.flash("success", "Tạo mới bài giới thiệu thành công");
    return res.json({
      code: "success",
    });
  } catch (error) {
    console.error("Lỗi khi tạo mới bài giới thiệu:", error);
    return res.json({
      code: "error",
      message: "Có lỗi xảy ra khi tạo mới bài giới thiệu",
    });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // nhận status = 0 hoặc 1
    await AboutModel.updateStatus(id, status);

    res.json({
      code: "success",
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra khi cập nhật trạng thái",
    });
  }
};

// edit
module.exports.aboutEdit = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      // id không hợp lệ
      req.flash("error", "ID bài giới thiệu không hợp lệ");
      return res.redirect(`/${pathAdmin}/about/list`);
    }

    const aboutDetail = await AboutModel.getById(id);

    if (!aboutDetail) {
      // id hợp lệ nhưng không tồn tại
      req.flash("error", "Bài giới thiệu không tồn tại");
      return res.redirect(`/${pathAdmin}/about/list`);
    }

    res.render("admin/pages/about-edit", {
      pageTitle: "Sửa bài giới thiệu",
      aboutDetail: aboutDetail,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi tải bài giới thiệu");
    res.redirect(`/${pathAdmin}/about/list`);
  }
};

// edit

module.exports.aboutEditPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    // Lấy dữ liệu từ form
    const data = {
      title: req.body.title,
      content: req.body.content,
    };

    // Nếu có avatar mới
    if (req.file) {
      data.avatar = req.file.path;
    }

    const updatedAbout = await AboutModel.update(id, data);

    if (!updatedAbout) {
      return res.json({
        code: "error",
        message: "Không tìm thấy bài giới thiệu cần cập nhật!",
      });
    }

    req.flash("success", "Cập nhật thành công");
    res.json({ code: "success" });
  } catch (err) {
    console.error(err);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra khi cập nhật bài giới thiệu!",
    });
  }
};

//Change-multi changeMultiPatch
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body; // ids = [1,2,3]

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json({ code: "error", message: "Chưa chọn bài nào!" });
    }

    switch (option) {
      case "0": // Ẩn
        await AboutModel.updateStatusMultiByIds(ids, 0);
        break;
      case "1": // Hiện
        await AboutModel.updateStatusMultiByIds(ids, 1);
        break;
      default:
        return res.json({ code: "error", message: "Tùy chọn không hợp lệ!" });
    }

    req.flash("success", "Đổi trạng thái thành công!");
    res.json({ code: "success" });
  } catch (err) {
    console.error(err);
    res.json({ code: "error", message: "Có lỗi xảy ra khi xử lý nhiều bản ghi!" });
  }
};

//end Change-multi
