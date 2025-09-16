const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const AccountsAdminModel = {
  async findByID(id) {
    const query = `SELECT * FROM accounts_admin WHERE id = $1 LIMIT 1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
  async findByEmail(email) {
    const query = `SELECT * FROM accounts_admin WHERE email = $1 LIMIT 1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async checkPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },
  async findOneByIdAndEmail(id, email) {
    const query = `
      SELECT * 
      FROM accounts_admin 
      WHERE id = $1 AND email = $2 AND status = 'active'
      LIMIT 1
    `;
    const { rows } = await pool.query(query, [id, email]);
    return rows[0] || null;
  },
  async selectAll() {
    const query = `SELECT * FROM accounts_admin ORDER BY created_at DESC`;
    const { rows } = await pool.query(query);
    return rows.length > 0 ? rows : null;
  },
  async selectAllWithCreator(currentUserId, limit, offset, filters = {}) {
    const values = [currentUserId];
    const conditions = [`a.id <> $1`];
    let index = 2;

    // filter status
    if (filters.status) {
      conditions.push(`a.status = $${index}`);
      values.push(filters.status);
      index++;
    }

    // filter startDate
    if (filters.startDate) {
      conditions.push(`a.created_at >= $${index}`);
      values.push(filters.startDate);
      index++;
    }

    // filter endDate
    if (filters.endDate) {
      conditions.push(`a.created_at <= $${index}`);
      values.push(filters.endDate);
      index++;
    }

    // search keyword
    if (filters.keyword) {
      conditions.push(`(
        a.full_name ILIKE $${index} OR 
        a.email ILIKE $${index} OR 
        a.phone ILIKE $${index}
      )`);
      values.push(`%${filters.keyword}%`);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        a.id,
        a.full_name,
        a.email,
        a.phone,
        a.role,
        a.avatar,
        a.status,
        a.created_at,
        a.create_by,
        a.province,
        c.full_name AS createdByName,
        p.name AS provinceName
      FROM accounts_admin a
      LEFT JOIN accounts_admin c ON a.create_by = c.id
      LEFT JOIN province p ON a.province = p.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async countAllExceptWithFilter(currentUserId, filters = {}) {
    const values = [currentUserId];
    const conditions = [`id <> $1`];
    let index = 2;

    if (filters.status) {
      conditions.push(`status = $${index}`);
      values.push(filters.status);
      index++;
    }
    if (filters.startDate) {
      conditions.push(`created_at >= $${index}`);
      values.push(filters.startDate);
      index++;
    }
    if (filters.endDate) {
      conditions.push(`created_at <= $${index}`);
      values.push(filters.endDate);
      index++;
    }
    if (filters.keyword) {
      conditions.push(`(
        full_name ILIKE $${index} OR 
        email ILIKE $${index} OR 
        phone ILIKE $${index}
      )`);
      values.push(`%${filters.keyword}%`);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT COUNT(*) FROM accounts_admin ${whereClause}`;
    const { rows } = await pool.query(query, values);
    return parseInt(rows[0].count, 10);
  },


  async addNew({
    fullName,
    email,
    phone,
    password,
    role,
    status,
    avatar,
    createBy,
    updateBy,
    province,
  }) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
      INSERT INTO accounts_admin
      (full_name, email, phone, password, role, status, avatar, create_by, update_by, created_at,province)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(),$10)
      RETURNING *
    `;

      const { rows } = await pool.query(query, [
        fullName,
        email,
        phone,
        hashedPassword,
        role,
        status,
        avatar,
        createBy,
        updateBy,
        province,
      ]);

      return rows[0];
    } catch (err) {
      console.error("Error adding new admin:", err);
      throw err;
    }
  },
  async updateAccount(id, data) {
    // Lấy dữ liệu cũ trong DB
    const oldAccount = await this.findByID(id);
    if (!oldAccount) return null;

    // Nếu không truyền password => giữ nguyên
    const password = data.password
      ? await bcrypt.hash(data.password, 10)
      : oldAccount.password;

    // Nếu không truyền avatar => giữ nguyên
    const avatar = data.avatar ? data.avatar : oldAccount.avatar;

    const query = `
    UPDATE accounts_admin
    SET 
      full_name = $1,
      email = $2,
      phone = $3,
      role = $4,
      avatar = $5,
      password = $6,
      status = $7,
      province = $8,
      update_by = $9,
      updated_at = NOW()
    WHERE id = $10
    RETURNING *;
  `;

    const values = [
      data.full_name || oldAccount.full_name,
      data.email || oldAccount.email,
      data.phone || oldAccount.phone,
      data.role || oldAccount.role,
      avatar,
      password,
      data.status || oldAccount.status,
      data.province || oldAccount.province,
      data.update_by || oldAccount.update_by,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deleteById(id) {
    try {
      const query = `DELETE FROM accounts_admin WHERE id=$1 RETURNING *`;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error deleting admin:", err);
      throw err;
    }
  },
  async countAll() {
    const query = `SELECT COUNT(*) FROM accounts_admin`;
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10);
  },

  async selectWithPagination(limit, offset) {
    const query = `
    SELECT *
    FROM accounts_admin
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  },
  async updateMultiByIds(ids, data) {
  try {
    const fields = [];
    const values = [];
    let index = 2; // bắt đầu từ $2 vì $1 sẽ là ids

    // build query động theo những field trong data
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    const query = `
      UPDATE accounts_admin
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = ANY($1::int[])
    `;

    await pool.query(query, [ids, ...values]);
    return true;
  } catch (err) {
    console.error("Error updateMultiByIds:", err);
    throw err;
  }
},

async deleteMultiByIds(ids) {
  try {
    const query = `DELETE FROM accounts_admin WHERE id = ANY($1::int[])`;
    await pool.query(query, [ids]);
    return true;
  } catch (err) {
    console.error("Error deleteMultiByIds:", err);
    throw err;
  }
}
};

module.exports = AccountsAdminModel;
