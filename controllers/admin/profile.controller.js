const RoleModel = require('../../models/role.model')
const UserModel = require("../../models/user.model");
module.exports.edit = async (req, res) => {
  res.render("admin/pages/profile-edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

module.exports.editPatch = async (req, res) => {
  try {
    const { full_name, phone } = req.body;

    // Validate tên
    if (!full_name || full_name.length < 5 || full_name.length > 255) {
      return res.status(400).json({ code: "error", message: "Họ tên không hợp lệ!" });
    }

    // Validate phone
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ code: "error", message: "Số điện thoại không hợp lệ!" });
    }


    // Lấy thông tin account trước
    const account = await UserModel.findByID(parseInt(req.account.id));
    if (!account) {
      return res.status(400).json({
        code:"error",
        message:"Không tồn tại trong hệ thống"
      });
    }
    const data = {
      full_name: full_name,
      phone: phone,
    };
    // Update
    await UserModel.updateAccount(parseInt(req.account.id), data);

    req.flash("success", "Cập nhật thông tin thành công");
    res.json({
        code:"success"
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
        code:"error",
        message:"Có lỗi khi cập nhật thông tin"
    })
  }
};



module.exports.changePassword = async (req, res) => {
  try {
    res.render("admin/pages/profile-change-password", {
      pageTitle: "Đổi mật khẩu",
    });
  } catch (err) {
    console.error(err);
    req.status(500).json("error", "Có lỗi khi tải trang");
  }
};
module.exports.changePasswordPatch = async (req, res) => {
  try {
    const { password } = req.body;
    const id = parseInt(req.account.id);
    console.log(id)
    if (!password) {
      return res.status(400).json({
        code: "error",
        message: "Vui lòng nhập mật khẩu!"
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        code: "error",
        message: "Mật khẩu phải chứa ít nhất 8 ký tự!"
      });
    }
    // Kiểm tra tài khoản
    const account = await UserModel.findByID(id);
    if (!account) {
      return res.status(404).json({
        code: "error",
        message: "Tài khoản không tồn tại"
      });
    }

    // Cập nhật mật khẩu
    await UserModel.updateAccount(id, {
      password,
      update_by: id
    });

    req.flash("success", "Đổi mật khẩu thành công");
    res.json({ code: "success" });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: "error",
      message: "Có lỗi khi đổi mật khẩu"
    });
  }
};


//  App
// Lấy thông tin profile
module.exports.editApp = async (req, res) => {
  try {
    const id = parseInt(req.account.id);
    const account = await UserModel.findByID(id);

    if (!account) {
      return res.status(404).json({ code: "error", message: "Không tìm thấy tài khoản" });
    }
    const role = await RoleModel.getById(account.role)
    const data = {
        id: account.id,
        full_name: account.full_name,
        phone: account.phone,
        email: account.email,
        rolename:role.name
      }
    console.log("dư liệu nè",data);
    res.json({
      code: "success",
      data:data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "error", message: "Lỗi server" });
  }
};


//  end App



