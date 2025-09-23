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
  // Lấy tất cả contact (có thể lọc theo status, keyword hoặc topic)
  async getAll({ status = null, keyword = null, topic = null } = {}) {
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

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT * FROM contacts
      ${whereClause}
      ORDER BY created_at DESC
    `;
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
  }
}

module.exports = ContactModel;
