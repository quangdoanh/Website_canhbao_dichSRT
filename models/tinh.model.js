// models/province.model.js
const pool = require("../config/database");

const TinhModel = {
  // Lấy tất cả tỉnh 
  async getAll() {
    try {
      const query = "SELECT * FROM public.tinh ORDER BY ma_tinh ASC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tỉnh theo mã
  async getById(ma_tinh) {
    try {
      const result = await pool.query(
        "SELECT * FROM tinh WHERE ma_tinh = $1",
        [ma_tinh]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

};

module.exports = TinhModel;
