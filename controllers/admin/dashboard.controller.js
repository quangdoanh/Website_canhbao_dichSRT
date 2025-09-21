module.exports.dashboard = async (req, res) => {
    console.log("Cookies khi vào dashboard:", req.cookies);

    res.render("admin/pages/dashboard", {
        pageTitle: "Tổng Quan",
    });
}