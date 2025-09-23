const pool = require("../config/database");

const HuyenModel = {
  async getAll() {
    const result = await pool.query("SELECT * FROM huyen ORDER BY ma_huyen ASC");
    return result.rows;
  },

  async getById(ma_huyen) {
    const result = await pool.query(
      "SELECT * FROM huyen WHERE ma_huyen = $1",
      [ma_huyen]
    );
    return result.rows[0];
  },

  // Lấy tất cả huyện theo tỉnh
  async getByProvince(ma_tinh) {
    const result = await pool.query(
      "SELECT * FROM huyen WHERE ma_tinh = $1 ORDER BY ma_huyen ASC",
      [ma_tinh]
    );
    return result.rows;
  },
  async getByMaTinh(ma_tinh) {
    const query = `
    SELECT *
    FROM huyen
    WHERE ma_tinh = $1
    ORDER BY ma_huyen ASC
  `;
    const result = await pool.query(query, [ma_tinh]);
    return result.rows;
  }

};

module.exports = HuyenModel;
