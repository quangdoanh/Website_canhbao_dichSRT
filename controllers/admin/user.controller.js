module.exports.list = async (req, res) => {
  res.render("admin/pages/user-list", {
    pageTitle: "Quản lý người dùng"
  })
}
module.exports.log = async (req, res) => {
  res.render("admin/pages/user-log", {
    pageTitle: "Lịch sử người dùng"
  })
}
