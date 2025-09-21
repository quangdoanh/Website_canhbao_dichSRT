const pool = require("../config/database");

const XaModel = {
  // Lấy tất cả xã
  async getAll() {
    try {
      const result = await pool.query("SELECT * FROM xa ORDER BY ten_xa ASC");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy xã theo mã
  async getById(ma_xa) {
    try {
      const result = await pool.query(
        "SELECT * FROM xa WHERE ma_xa = $1",
        [ma_xa]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả xã theo huyện
  async getByDistrict(ma_huyen) {
    try {
      const result = await pool.query(
        "SELECT * FROM xa WHERE ma_huyen = $1 ORDER BY ten_xa ASC",
        [ma_huyen]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả xã theo tỉnh
  async getByProvince(ma_tinh) {
    try {
      const result = await pool.query(
        "SELECT * FROM xa WHERE ma_tinh = $1 ORDER BY ten_xa ASC",
        [ma_tinh]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = XaModel;
