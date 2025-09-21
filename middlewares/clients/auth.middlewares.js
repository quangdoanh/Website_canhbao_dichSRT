const jwt = require('jsonwebtoken');
const UserAdmin = require('../../models/user.model');
const variableConfig = require('../../config/variable');
const RoleModel = require('../../models/role.model');
module.exports.verifyTokenUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { id, email } = decoded;

            // Chỉ kiểm tra account có tồn tại và active
            const existAccount = await UserAdmin.findOneByIdAndEmail(id, email);
            // const Role = await RoleModel.getRoleById(existAccount.role);

            // existAccount.rolename = Role.name;
            if (!existAccount) {
                //res.clearCookie("token");
                return res.redirect(`/${variableConfig.pathAdmin}/account/login`);
            }

            // Gán thông tin user vào request và locals (để view pug dùng được)
            req.account = existAccount;
            res.locals.account = existAccount;
        } else {
            req.account = "guest";
            res.locals.account = "guest";
        }

        console.log(req.account, "1")
        console.log(res.locals.account, "2")

        next();
    } catch (error) {
        console.error("JWT verify error:", error.message);
        res.clearCookie("token");
        res.redirect(`/`);
    }
};
