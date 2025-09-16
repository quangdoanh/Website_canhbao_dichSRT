const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const ProvinceModel = {
  async getAll() {
    const query = `
        SELECT *
        FROM province
        ORDER BY id ASC
        `;
    const { rows } = await pool.query(query);
    return rows;
  },
  async getProvinceById(id) {
    const query = `
        SELECT *
        FROM province
        WHERE id = $1
        LIMIT 1
      `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Trả về 1 object thay vì mảng
  },
};

module.exports = ProvinceModel;
