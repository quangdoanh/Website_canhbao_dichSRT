const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');
const variableConfig = require('../../config/variable');

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

    if (!existAccount) {
      res.clearCookie("token");
      return res.redirect(`/${variableConfig.pathAdmin}/account/login`);
    }

    // Gán thông tin user vào request và locals (để view pug dùng được)
    req.account = existAccount;
    res.locals.account = existAccount;

    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    res.clearCookie("token");
    res.redirect(`/${variableConfig.pathAdmin}/account/login`);
  }
};
