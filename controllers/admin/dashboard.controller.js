module.exports.dashboard = async (req, res) => {
    if (req.permissions && req.permissions.includes("dashboard-view")) {
        res.render("admin/pages/dashboard", {
            pageTitle: "Tổng Quan",
        });
    } else {
        res.status(403).render("admin/pages/error", {
            pageTitle: "Không có quyền truy cập",
            message: "Bạn không được phép truy cập trang này hãy chọn trang khác.",
        });
    }



}
