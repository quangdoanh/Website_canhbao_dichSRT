const HuyenModel = require("../../models/huyen.model");
const XaModel = require("../../models/xa.model");
const TinhModel = require("../../models/tinh.model");

module.exports.list = async (req, res) => {
  try {
    const ListTinh = await TinhModel.getAll();
    const ListHuyen = await HuyenModel.getAll();
    const ListXa = await XaModel.getAll();

    // Gom nhóm xã theo huyện
    const grouped = {};
    ListXa.forEach((xa) => {
      if (!grouped[xa.ma_huyen]) {
        grouped[xa.ma_huyen] = [];
      }
      grouped[xa.ma_huyen].push({
        ma_xa: xa.ma_xa,
        ten_xa: xa.ten_xa,
      });
    });

    res.json({
      code: "success",
      data: {
        ListTinh,
        ListHuyen,
        ListXaTheoHuyen: grouped
      }
    });

  } catch (err) {
    console.error("Lỗi khi lấy location:", err);
    res.status(500).json({ code: "error", message: "Lỗi server" });
  }
};
