const pool = require("../config/database"); // pool từ pg

const RoleModel = {
  async getRoleById(id) {
    const query = `
    SELECT *
    FROM roles
    WHERE id = $1
    LIMIT 1
  `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Trả về 1 object thay vì mảng
  },
  // Lấy danh sách tất cả role
  async getAll() {
    const query = `
    SELECT *
    FROM roles
    ORDER BY id ASC
  `;
    const result = await pool.query(query);
    return result.rows;
  },
  async getList(limit, offset, filters = {}) {
    const values = [];
    const conditions = ["1=1"]; // mặc định để nối WHERE

    let index = 1;

    // 🔎 search keyword
    if (filters.keyword) {
      conditions.push(`(
      name ILIKE $${index} OR 
      description ILIKE $${index}
    )`);
      values.push(`%${filters.keyword}%`);
      index++;
    }

    // query chính
    let query = `
    SELECT *
    FROM roles
    WHERE ${conditions.join(" AND ")}
    ORDER BY id ASC
  `;

    // phân trang
    if (limit) {
      query += ` LIMIT $${index}`;
      values.push(limit);
      index++;
    }
    if (offset) {
      query += ` OFFSET $${index}`;
      values.push(offset);
      index++;
    }

    const result = await pool.query(query, values);
    return result.rows;
  },
  async countAll(filters = {}) {
    const values = [];
    const conditions = ["1=1"];
    let index = 1;

    if (filters.keyword) {
      conditions.push(`(
      name ILIKE $${index} OR 
      description ILIKE $${index}
    )`);
      values.push(`%${filters.keyword}%`);
      index++;
    }

    const query = `SELECT COUNT(*) FROM roles WHERE ${conditions.join(
      " AND "
    )}`;
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Lấy chi tiết role theo id
  async getById(id) {
    const query = `SELECT * FROM roles WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Tạo role mới
  async addNew(data) {
    const query = `
      INSERT INTO roles (name, description, permissions, create_by, update_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      data.name,
      data.description,
      data.permissions, // mảng text[]
      data.createBy,
      data.updateBy,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Cập nhật role
  async updateRole(id, data) {
    const query = `
      UPDATE roles
      SET name=$1, description=$2, permissions=$3, update_by=$4, updated_at=NOW()
      WHERE id=$5
      RETURNING *;
    `;
    const values = [
      data.name,
      data.description,
      data.permissions,
      data.updateBy,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  // Xóa role
  async deleteRole(id) {
    const query = `DELETE FROM roles WHERE id=$1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // trả về role đã bị xóa
  },
  async deleteMultiByIds(ids) {
    try {
      const query = `DELETE FROM roles WHERE id = ANY($1::int[])`;
      await pool.query(query, [ids]);
      return true;
    } catch (err) {
      console.error("Error deleteMultiByIds:", err);
      throw err;
    }
  },
};

module.exports = RoleModel;
