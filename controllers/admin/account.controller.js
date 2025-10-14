const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user.model");
const Log = require(`../../helpers/loguser.helper`)
const RoleModel = require('../../models/role.model');
module.exports.login = (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng Nhập"
  })
}
module.exports.loginPost = async (req, res) => {


  const { email, password, rememberPassword } = req.body;
  try {

    const existAccount = await UserModel.findByEmail(email);
    if (!existAccount) {
      return res.json({
        code: "error",
        message: "Email không tồn tại"
      });
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await UserModel.checkPassword(password, existAccount.password);
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
        email: existAccount.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberPassword ? "30d" : "1d"
      }
    );
    console.log(token)
    console.log("JWT_SECRET: 1", process.env.JWT_SECRET);


    // 5. Lưu token vào cookie
    res.cookie("token", token, {
      maxAge: rememberPassword
        ? 30 * 24 * 60 * 60 * 1000 // 30 ngày
        : 24 * 60 * 60 * 1000, // 1 ngày
      httpOnly: true,
      sameSite: "strict",
    });

    // ghi log đăng nhập  user
    // const user = email;
    // if (user) {
    //   Log.logUser(user, req.originalUrl, req.method, "Đăng nhập")
    // }
    // 
    const Role = await RoleModel.getRoleById(existAccount.role);

    if (Role.name.includes("User")) {
      res.json({
        code: "success",
        message: "Đăng nhập tài khoản thành công!",
        token: token,
        role: "user",
      });
    } else {
      res.json({
        code: "success",
        message: "Đăng nhập tài khoản thành công!",
        token: token,
        role: "admin",
      });
    }

    // 6. Trả kết quả


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      code: "error",
      message: "Lỗi server"
    });
  }
}
module.exports.logoutPost = async (req, res) => {


  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}

