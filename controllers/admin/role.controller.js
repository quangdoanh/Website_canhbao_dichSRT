const RoleModel = require("../../models/role.model");
const permissionConfig = require("../../config/permission");
const Log = require("../../helpers/loguser.helper")

module.exports.roleList = async (req, res) => {
  try {
    const limit = 3; // số role mỗi trang
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    const filters = {
      keyword: req.query.keyword || null,
    };

    // Tổng số bản ghi (theo keyword nếu có)
    const totalRecords = await RoleModel.countAll(filters);
    const totalPages = Math.ceil(totalRecords / limit);
    if (page > totalPages && totalPages > 0) page = totalPages;

    const offset = (page - 1) * limit;

    // Lấy danh sách role
    const roleList = await RoleModel.getList(limit, offset, filters);

    res.render("admin/pages/role-list", {
      pageTitle: "Nhóm quyền",
      roleList,
      pagination: { page, totalPages, totalRecords },
      limit,
      filters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

module.exports.roleCreate = async (req, res) => {
  res.render("admin/pages/role-create", {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionConfig.permissionList,
  });
};

module.exports.roleCreatePost = async (req, res) => {
  // if (!req.permissions.includes("rolelist-create")) {
  //   return res.json({
  //     code: "error",
  //     message: "Không có quyền sử dụng tính năng này!",
  //   });
  // }

  req.body.createBy = req.account.id;
  req.body.updateBy = req.account.id;

  const newRole = await RoleModel.addNew(req.body);

  req.flash("success", "Tạo nhóm quyền thành công");
  res.json({ code: "success" });
};

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const roleDetail = await RoleModel.getById(id);

    if (roleDetail) {
      res.render("admin/pages/role-edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        permissionList: permissionConfig.permissionList,
        roleDetail,
      });
    } else {
      res.redirect("/admin/role/list");
    }
  } catch (error) {
    res.redirect("/admin/role/list");
  }
};

module.exports.roleEditPatch = async (req, res) => {
  // if (!req.permissions.includes("rolelist-edit")) {
  //   return res.json({
  //     code: "error",
  //     message: "Không có quyền sử dụng tính năng này!",
  //   });
  // }

  try {
    const id = req.params.id;
    req.body.updateBy = req.account.id;

    const updatedRole = await RoleModel.updateRole(id, req.body);

    if (!updatedRole) {
      return res.json({ code: "error", message: "Id không tồn tại!" });
    }
    const user = req.account?.email;
    if (user) {
      Log.logUser(user, req.originalUrl, req.method, "Sửa nhóm quyền")
    }

    req.flash("success", "Cập nhật nhóm quyền thành công!");
    res.json({ code: "success", role: updatedRole });
  } catch (error) {
    res.json({ code: "error", message: error.message });
  }
};
// Xóa role
module.exports.roleDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRole = await RoleModel.deleteRole(id);

    if (!deletedRole) {
      return res.json({ code: "error", message: "Id không tồn tại!" });
    }
    const user = req.account?.email;
    if (user) {
      Log.logUser(user, req.originalUrl, req.method, "Xóa nhóm quyền")
    }

    req.flash("success", "Xóa nhóm quyền thành công!");
    res.json({ code: "success" });
  } catch (error) {
    res.json({ code: "error", message: error.message });
  }
};

module.exports.changeMultiDelete = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "delete":
        await RoleModel.deleteMultiByIds(ids);
        const user = req.account?.email;
        if (user) {
          Log.logUser(user, req.originalUrl, req.method, "Xóa  nhóm quyền")
        }

        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!",
    });
  }
};
