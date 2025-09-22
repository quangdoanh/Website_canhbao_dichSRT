const pool = require("../config/database");

const DegradModel = {
    async findById(id) {
        const query = `SELECT * FROM degrad WHERE id = $1 LIMIT 1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },
  // Đếm tổng số bản ghi theo status
  async countByStatus(status) {
    const query = `SELECT COUNT(*) AS total FROM degrad WHERE status = $1`;
    const result = await pool.query(query, [status]);
    return parseInt(result.rows[0].total, 10);
  },

  // Lấy danh sách theo status + phân trang
  async getByStatusWithPagination(status, limit, offset) {
    const query = `
      SELECT *
      FROM degrad
      WHERE status = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [status, limit, offset]);
    return result.rows;
  },
  // Cập nhật trạng thái cho 1 bản ghi
  async updateStatus(id, status) {
    const query = `
      UPDATE degrad
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0] || null;
  },

  // Cập nhật trạng thái cho nhiều bản ghi
  async updateStatusMultiByIds(ids, status) {
    if (!Array.isArray(ids) || ids.length === 0) return false;

    const query = `
      UPDATE degrad
      SET status = $1
      WHERE id = ANY($2::int[])
    `;
    await pool.query(query, [status, ids]);
    return true;
  }
};

module.exports = DegradModel;
