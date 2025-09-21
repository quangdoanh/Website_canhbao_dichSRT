
const UserModel = require("../../models/user.model");
const ProvinceModel = require("../../models/province.model");
const LogUserModel = require("../../models/log_user.model")
const RoleModel = require("../../models/role.model");
const AccountsAdminModel = require("../../models/account-admin.model")

const moment = require("moment/moment")
module.exports.list = async (req, res) => {
  try {
    const Province = await ProvinceModel.getProvinceById();
    const filters = {
      status: req.query.status || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      role: req.query.role || null,
      keyword: req.query.keyword || null,
    };
    const limit = 3;
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // Tổng số bản ghi (trừ chính mình)
    const totalRecords = await UserModel.countAllExceptWithFilter(
      req.account.id,
      filters
    );
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;
    const offset = (page - 1) * limit;

    // Lấy danh sách phân trang (trừ chính mình)
    const RoleList = await RoleModel.getAll();
    const accountUserList = await UserModel.selectAllWithCreator(
      req.account.id,
      limit,
      offset,
      filters
    );
    // Loc
    for (const item of accountUserList) {
      if (item.role) {
        const roleInf = await RoleModel.getRoleById(item.role);

        if (roleInf) {
          item.roleName = roleInf.name;
        }
      }
    }
    for (const item of accountUserList) {
      if (item.province) {
        const provinceInf = await ProvinceModel.getProvinceById(item.province);

        if (provinceInf) {
          item.provinceName = provinceInf.name;
        }
      }
    }
    for (const item of accountUserList) {
      if (item.create_by) {
        const accountInf = await UserModel.findByID(item.create_by);

        if (accountInf) {
          item.createdByName = accountInf.full_name;
        }
      }
    }

    console.log(accountUserList);

    res.render("admin/pages/user-list", {
      pageTitle: "Danh sách tài khoản",
      accountUserList: accountUserList,
      pagination: { page, totalPages, totalRecords },
      limit: limit,
      filters: filters,
      RoleList: RoleList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.userCreate = async (req, res) => {
  const Province = await ProvinceModel.getAll();
  const RoleList = await RoleModel.getAll();
  res.render("admin/pages/user-create", {
    pageTitle: "Tạo tài khoản ",
    Province: Province,
    RoleList: RoleList,
  });
};
module.exports.userCreatePost = async (req, res) => {
  try {
    // Kiểm tra email tồn tại
    const existAccount = await UserModel.findByEmail(req.body.email);
    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
    }

    // Gán thông tin thêm
    const newUserData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status || "initial",
      createBy: req.account?.id || null,
      updateBy: req.account?.id || null,
      avatar: req.file ? req.file.path : "",
      password: req.body.password,
      province: req.body.province,
    };
    // console.log("Dữ liệu thêm mới: ", newUserData);

    // Lưu vào DB thông qua model (model sẽ hash password)
    await UserModel.addNew(newUserData);

    req.flash("success", "Tạo tài khoản thành công");
    res.json({
      code: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "error", message: "Lỗi server" });
  }
};

module.exports.UserEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const accountUser = await UserModel.findByID(parseInt(id));
    const Province = await ProvinceModel.getAll();
    const RoleList = await RoleModel.getAll();
    res.render("admin/pages/user-edit", {
      pageTitle: "Trang chỉnh sửa",
      accountUserDetail: accountUser,
      Province: Province,
      RoleList: RoleList,
    });
  } catch (err) {
    console.error(err);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra khi cập nhật tài khoản!",
    });
  }
};
module.exports.UserEditPatch = async (req, res) => {
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

    const updatedAccount = await UserModel.updateAccount(id, data);

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
module.exports.UserDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.deleteById(parseInt(id));
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
        await UserModel.updateMultiByIds(ids, {
          status: option,
          update_by: req.account.id,
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;

      case "delete":
        await UserModel.deleteMultiByIds(ids);
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


module.exports.log = async (req, res) => {

  try {
    const logUserList = await LogUserModel.getAll();

    for (const item of logUserList) {


      item.timeDo = moment(item.time).format("HH:mm - DD/MM/YYYY");

    }


    //console.log(logUserList);

    res.render("admin/pages/user-log", {
      pageTitle: "Lịch sử người dùng",
      logUserList: logUserList

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
}
