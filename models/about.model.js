const pool = require("../config/database");

const AboutModel = {
  // Lấy tất cả bài giới thiệu (chỉ lấy những cái chưa bị xóa)
  async getAll() {
    const query = `
      SELECT *
      FROM about
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },
  async getByStatus() {
    const query = `
      SELECT *
      FROM about
      WHERE status = 1
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Lấy 1 bài giới thiệu theo id
  async getById(id) {
    const query = `
      SELECT *
      FROM about
      WHERE id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Tạo mới bài giới thiệu
  async addNew({ title, content, avatar, status = 1, create_by }) {
    const query = `
      INSERT INTO about (title, content, avatar, status, create_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, content, avatar, status, create_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Cập nhật bài giới thiệu
  async update(id, data) {
    // Lấy dữ liệu cũ
    const oldAbout = await this.getById(id);
    if (!oldAbout) return null;

    // Chỉ update avatar nếu có
    const avatar = data.avatar ? data.avatar : oldAbout.avatar;

    const query = `
      UPDATE about
      SET title = $1,
          content = $2,
          avatar = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;

    const values = [
      data.title || oldAbout.title,
      data.content || oldAbout.content,
      avatar,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Xóa mềm
  async softDelete(id) {
    const query = `
      UPDATE about
      SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  async updateStatus(id, status) {
    const query = `UPDATE about SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },
  async updateStatusMultiByIds(ids, status) {
    if (!Array.isArray(ids) || ids.length === 0) return false;

    const query = `
    UPDATE about
    SET status = $1, updated_at = NOW()
    WHERE id = ANY($2::int[])
  `;
    await pool.query(query, [status, ids]);
    return true;
  },
  async selectAllWithKeyword(limit, offset, keyword = "") {
    const values = [];
    let index = 1;
    let whereClause = "";

    if (keyword) {
      whereClause = `WHERE title ILIKE $${index} OR content ILIKE $${index}`;
      values.push(`%${keyword}%`);
      index++;
    }

    const query = `
    SELECT *
    FROM about
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${index} OFFSET $${index + 1}
  `;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async countAllWithKeyword(keyword = "") {
    const values = [];
    let index = 1;
    let whereClause = "";

    if (keyword) {
      whereClause = `WHERE title ILIKE $${index} OR content ILIKE $${index}`;
      values.push(`%${keyword}%`);
    }

    const query = `SELECT COUNT(*) FROM about ${whereClause}`;
    const { rows } = await pool.query(query, values);
    return parseInt(rows[0].count, 10);
  },
};

module.exports = AboutModel;
