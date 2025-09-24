const pool = require("../config/database");

const ContactModel = {
   async addNew({ full_name, email, phone, message,topic }) {
  const query = `
    INSERT INTO contacts (full_name, email, phone, message,topic, status)
    VALUES ($1, $2, $3, $4,$5, 0)
    RETURNING *
  `;
  const values = [full_name, email, phone || null, message,topic];
  const { rows } = await pool.query(query, values);
  return rows[0];
    }, 
  // Đếm tổng số bản ghi (có filter nếu cần)
  async countAll({ status = null, keyword = null, topic = null, is_public = null } = {}) {
    const conditions = [];
    const values = [];
    let index = 1;

    if (status !== null) {
      conditions.push(`status = $${index}`);
      values.push(status);
      index++;
    }
    if (keyword) {
      conditions.push(`(full_name ILIKE $${index} OR email ILIKE $${index} OR message ILIKE $${index})`);
      values.push(`%${keyword}%`);
      index++;
    }
    if (topic) {
      conditions.push(`topic = $${index}`);
      values.push(topic);
      index++;
    }
    if (is_public !== null) {
      conditions.push(`is_public = $${index}`);
      values.push(is_public);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `SELECT COUNT(*) AS total FROM contacts ${whereClause}`;
    const { rows } = await pool.query(query, values);
    return parseInt(rows[0].total, 10);
  },

  // Lấy danh sách có phân trang
  async getAllWithPagination({ status = null, keyword = null, topic = null, is_public = null, limit, offset }) {
    const conditions = [];
    const values = [];
    let index = 1;

    if (status !== null) {
      conditions.push(`status = $${index}`);
      values.push(status);
      index++;
    }
    if (keyword) {
      conditions.push(`(full_name ILIKE $${index} OR email ILIKE $${index} OR message ILIKE $${index})`);
      values.push(`%${keyword}%`);
      index++;
    }
    if (topic) {
      conditions.push(`topic = $${index}`);
      values.push(topic);
      index++;
    }
    if (is_public !== null) {
      conditions.push(`is_public = $${index}`);
      values.push(is_public);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT *
      FROM contacts
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
  },

  // Lấy contact theo ID
  async getById(id) {
    const query = `SELECT * FROM contacts WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Cập nhật trả lời và trạng thái
  async answerAndUpdateStatus(id, { answer, status }) {
    const query = `
      UPDATE contacts
      SET answer = $1,
          status = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const values = [answer, status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async updatePublic(id, is_public) {
    const query = `
      UPDATE contacts
      SET is_public = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const values = [is_public, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

 // Đếm số câu hỏi public theo topic
  async countPublic(topic) {
    const query = `
      SELECT COUNT(*) AS total
      FROM contacts
      WHERE status = 1 
        AND is_public = true
        AND topic = $1
    `;
    const { rows } = await pool.query(query, [topic]);
    return parseInt(rows[0].total, 10);
  },

  // Lấy danh sách có phân trang
  async getPublicWithPagination(topic, limit, offset) {
    const query = `
      SELECT id, full_name, message, answer, topic, created_at, updated_at
      FROM contacts
      WHERE status = 1 
        AND is_public = true
        AND topic = $1
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(query, [topic, limit, offset]);
    return rows;
  },
  async updatePublicMulti(ids, is_public) {
    try {
      const query = `
        UPDATE contacts
        SET is_public = $1
        WHERE id = ANY($2::int[])
        RETURNING *
      `;
      const values = [is_public, ids];
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error("Error updatePublicMulti:", err);
      throw err;
    }
  }


}

module.exports = ContactModel;
