const pool = require("../config/database");

const uploadMap = {
  async countAll(filters = {}) {
    const values = [];
    const conditions = [];
    let index = 1;

    if (filters.loaibando) {
      conditions.push(`um.loaibando = $${index}`);
      values.push(filters.loaibando);
      index++;
    }

    if (filters.ma_tinh) {
      conditions.push(`um.ma_tinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `SELECT COUNT(*) AS total FROM public.uploadmap um ${whereClause}`;
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].total, 10);
  },

  // Lấy dữ liệu phân trang có filter
  async getAllWithPagination(limit, offset, filters = {}) {
    const values = [];
    const conditions = [];
    let index = 1;

    if (filters.loaibando) {
      conditions.push(`um.loaibando = $${index}`);
      values.push(filters.loaibando);
      index++;
    }

    if (filters.ma_tinh) {
      conditions.push(`um.ma_tinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT um.*, t.ten_tinh
      FROM public.uploadmap um
      LEFT JOIN tinh t ON um.ma_tinh = t.ma_tinh::varchar
      ${whereClause}
      ORDER BY um.id DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(sql, values);
    return result.rows;
  },
  async getAll() {
    try {
      const query = `
            SELECT *
            FROM public.uploadmap
            ORDER BY id ASC`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
    async getLoaiMap() {
    try {
      const query = `
            SELECT id,loaibando
            FROM public.uploadmap
            ORDER BY id ASC`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  async create({ thongtin, loaibando, file, mota, matinh }) {
    try {
      const query = `
            INSERT INTO public.uploadmap (thongtin, loaibando, file, mota, ma_tinh)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
      const values = [thongtin, loaibando, file, mota, matinh];
      const result = await pool.query(query, values);
      return result.rows[0]; // trả về record vừa insert
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    try {
      const query = `
            SELECT * FROM public.uploadmap 
            WHERE id = $1
            LIMIT 1;
            `;
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows[0]; // trả về 1 record
    } catch (error) {
      throw error;
    }
  },
  async updateById(id, { thongtin, loaibando, file, mota, matinh }) {
    try {
      const query = `
            UPDATE public.uploadmap
            SET thongtin = $2,
                loaibando = $3,
                file = $4,
                mota = $5,
                ma_tinh = $6
            WHERE id = $1
            RETURNING *;
        `;
      const values = [id, thongtin, loaibando, file, mota, matinh];
      const result = await pool.query(query, values);
      return result.rows[0]; // trả về record vừa update
    } catch (error) {
      throw error;
    }
  },
  async deleteById(id) {
    try {
      const query = `
            DELETE FROM public.uploadmap
            WHERE id = $1
            RETURNING *;
        `;
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows[0]; // trả về record vừa xóa
    } catch (error) {
      throw error;
    }
  },
};
module.exports = uploadMap;
