const pool = require("../config/database");

const WeatherModel = {
  async findById(id) {
    const query = `SELECT * FROM weather_data WHERE id = $1 LIMIT 1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
  // Đếm tổng số bản ghi
  async countAll() {
    const query = `SELECT COUNT(*) AS total FROM weather_data`;
    const result = await pool.query(query);
    return parseInt(result.rows[0].total, 10);
  },

  // Lấy dữ liệu phân trang
  async getAllWithPagination(limit, offset) {
    const query = `
      SELECT * 
      FROM weather_data 
      ORDER BY ngay_cap_nhat DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },
};

module.exports = WeatherModel;
