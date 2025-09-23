const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/user.model');
const variableConfig = require('../../config/variable');
const RoleModel = require('../../models/role.model');

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;


    if (!token) {
      return res.redirect(`/${variableConfig.pathAdmin}/account/login`);

    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;

    // Chỉ kiểm tra account có tồn tại và active
    const existAccount = await AccountAdmin.findOneByIdAndEmail(id, email);
    const Role = await RoleModel.getRoleById(existAccount.role);
    //console.log("Sau verify:", existAccount);
    existAccount.rolename = Role.name;
    if (!existAccount) {
      res.clearCookie("token");
      return res.redirect(`/${variableConfig.pathAdmin}/account/login`);
    }

    // Gán thông tin user vào request và locals (để view pug dùng được)
    req.account = existAccount;
    res.locals.account = existAccount;
    //console.log(req.account);
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    console.log("bị lỗi hệ thống")
    res.clearCookie("token");
    res.redirect(`/${variableConfig.pathAdmin}/account/login`);
  }
};
