const AccountsAdminModel = require("../../models/account-admin.model");
const ProvinceModel = require("../../models/province.model");
module.exports.list = async (req, res) => {
  try {
    const Province = await ProvinceModel.getAll();
    const filters = {
      status: req.query.status || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      keyword: req.query.keyword || null,
    };
    const limit = 4;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // Tổng số bản ghi (trừ chính mình)
    const totalRecords = await AccountsAdminModel.countAllExceptWithFilter(
      req.account.id,
      filters
    );
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;
    const offset = (page - 1) * limit;

    // Lấy danh sách phân trang (trừ chính mình)
    const accountAdminList = await AccountsAdminModel.selectAllWithCreator(
      req.account.id,
      limit,
      offset,
      filters
    );

    res.render("admin/pages/account-admin-list", {
      pageTitle: "Danh sách tài khoản",
      accountAdminList,
      pagination: { page, totalPages, totalRecords },
      limit,
      filters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.adminCreate = async (req, res) => {
  const Province = await ProvinceModel.getAll();
  res.render("admin/pages/account-admin-create", {
    pageTitle: "Tạo tài khoản ",
    Province: Province,
  });
};
module.exports.adminCreatePost = async (req, res) => {
  try {
    // Kiểm tra email tồn tại
    const existAccount = await AccountsAdminModel.findByEmail(req.body.email);
    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
    }

    // Gán thông tin thêm
    const newAdminData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status || "initial",
      createBy: req.account?.id,
      updateBy: req.account?.id,
      avatar: req.file ? req.file.path : "",
      password: req.body.password,
      province: req.body.province,
    };
    // console.log("Dữ liệu thêm mới: ", newAdminData);

    // Lưu vào DB thông qua model (model sẽ hash password)
    const newAdmin = await AccountsAdminModel.addNew(newAdminData);

    req.flash("success", "Tạo tài khoản thành công");
    res.json({
      code: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "error", message: "Lỗi server" });
  }
};

module.exports.adminEdit = async (req, res) => {
  const { id } = req.params;

  const accountAdmin = await AccountsAdminModel.findByID(parseInt(id));
  const Province = await ProvinceModel.getAll();
  res.render("admin/pages/account-admin-edit", {
    pageTitle: "Trang chỉnh sửa",
    accountAdminDetail: accountAdmin,
    Province: Province,
  });
};
module.exports.adminEditPatch = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Lấy dữ liệu từ form
    const data = {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status,
      province: req.body.province,
      update_by: req.account.id, // ai update
    };

    // Nếu có password mới
    if (req.body.password && req.body.password.trim() !== "") {
      data.password = req.body.password; // hash ở trong model
    }

    // Nếu có avatar mới
    if (req.file) {
      data.avatar = req.file.path;
    }

    const updatedAccount = await AccountsAdminModel.updateAccount(id, data);

    if (!updatedAccount) {
      return res.json({
        code: "error",
        message: "Không tìm thấy tài khoản cần cập nhật!",
      });
    }

    req.flash("success", "Cập nhật thành công thành công");
    res.json({
      code: "success",
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra khi cập nhật tài khoản!",
    });
  }
};
module.exports.adminDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await AccountsAdminModel.deleteById(parseInt(id));
    req.flash("success", "Xóa thành công");
    res.json({ code: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "error", message: "Lỗi server" });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await AccountsAdminModel.updateMultiByIds(ids, {
          status: option,
          update_by: req.account.id,
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;

      case "delete":
        await AccountsAdminModel.deleteMultiByIds(ids);
        req.flash("success", "Xóa thành công!");
        break;

      default:
        return res.json({
          code: "error",
          message: "Tùy chọn không hợp lệ!",
        });
    }

    res.json({ code: "success" });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!",
    });
  }
};
