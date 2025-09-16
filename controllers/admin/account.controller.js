const jwt = require("jsonwebtoken");
const AccountsAdminModel = require("../../models/account-admin.model");
module.exports.login = (req, res) => {
    res.render("admin/pages/login",{
      pageTitle:"Đăng Nhập"
    })
}
module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  try {
    // 1. Tìm tài khoản theo email
    const existAccount = await AccountsAdminModel.findByEmail(email);
    if (!existAccount) {
      return res.json({
        code: "error",
        message: "Email không tồn tại"
      });
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await AccountsAdminModel.checkPassword(password, existAccount.password);
    if (!isPasswordValid) {
      return res.json({
        code: "error",
        message: "Mật khẩu không đúng!"
      });
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (existAccount.status !== "active") {
      return res.json({
        code: "error",
        message: "Tài khoản chưa được kích hoạt!"
      });
    }

    // 4. Tạo JWT
    const token = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
        role: existAccount.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberPassword ? "30d" : "1d"
      }
    );

    // 5. Lưu token vào cookie
    res.cookie("token", token, {
      maxAge: rememberPassword
        ? 30 * 24 * 60 * 60 * 1000 // 30 ngày
        : 24 * 60 * 60 * 1000, // 1 ngày
      httpOnly: true,
      sameSite: "strict"
    });

    // 6. Trả kết quả
    res.json({
      code: "success",
      message: "Đăng nhập tài khoản thành công!",
      token: token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      code: "error",
      message: "Lỗi server"
    });
  }
};

module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}

