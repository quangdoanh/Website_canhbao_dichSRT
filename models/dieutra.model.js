const pool = require("../config/database");

const DieuTra = {
  // Lấy tất cả bản ghi
// Lấy tất cả bản ghi kèm tên tỉnh, huyện, xã
// Đếm tổng số bản ghi (có filter)
  async countAll(filters = {}) {
    const values = [];
    const conditions = ["dt.status = 1"]; // chỉ lấy status = 1
    let index = 1;

    if (filters.keyword) {
      conditions.push(`
        (
          dt.dia_chi_cu_the ILIKE '%' || $${index} || '%'
          OR t.ten_tinh     ILIKE '%' || $${index} || '%'
          OR h.ten_huyen    ILIKE '%' || $${index} || '%'
          OR x.ten_xa       ILIKE '%' || $${index} || '%'
        )
      `);
      values.push(filters.keyword);
      index++;
    }

    if (filters.ma_tinh) {
      conditions.push(`dt.ma_tinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }
    if (filters.ma_huyen) {
      conditions.push(`dt.ma_huyen = $${index}`);
      values.push(filters.ma_huyen);
      index++;
    }
    if (filters.ma_xa) {
      conditions.push(`dt.ma_xa = $${index}`);
      values.push(filters.ma_xa);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT COUNT(*) AS total
      FROM dieu_tra dt
      LEFT JOIN tinh  t ON dt.ma_tinh = t.ma_tinh
      LEFT JOIN huyen h ON dt.ma_huyen = h.ma_huyen
      LEFT JOIN xa    x ON dt.ma_xa    = x.ma_xa
      ${whereClause}
    `;

    const result = await pool.query(sql, values);
    return parseInt(result.rows[0].total, 10);
  },

  // Lấy dữ liệu phân trang (có filter)
  async getAllWithPagination(limit, offset, filters = {}) {
    const values = [];
    const conditions = ["dt.status = 1"];
    let index = 1;

    if (filters.keyword) {
      conditions.push(`
        (
          dt.dia_chi_cu_the ILIKE '%' || $${index} || '%'
          OR t.ten_tinh     ILIKE '%' || $${index} || '%'
          OR h.ten_huyen    ILIKE '%' || $${index} || '%'
          OR x.ten_xa       ILIKE '%' || $${index} || '%'
        )
      `);
      values.push(filters.keyword);
      index++;
    }

    if (filters.ma_tinh) {
      conditions.push(`dt.ma_tinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }
    if (filters.ma_huyen) {
      conditions.push(`dt.ma_huyen = $${index}`);
      values.push(filters.ma_huyen);
      index++;
    }
    if (filters.ma_xa) {
      conditions.push(`dt.ma_xa = $${index}`);
      values.push(filters.ma_xa);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT dt.*, 
            t.ten_tinh, 
            h.ten_huyen, 
            x.ten_xa
      FROM dieu_tra dt
      LEFT JOIN tinh  t ON dt.ma_tinh = t.ma_tinh
      LEFT JOIN huyen h ON dt.ma_huyen = h.ma_huyen
      LEFT JOIN xa    x ON dt.ma_xa    = x.ma_xa
      ${whereClause}
      ORDER BY dt.dtra_date DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);
    const result = await pool.query(sql, values);
    return result.rows;
  },
  async getByIdWithNames(id) {
    try {
      const sql = `
        SELECT dt.*, 
              t.ten_tinh, 
              h.ten_huyen, 
              x.ten_xa
        FROM dieu_tra dt
        LEFT JOIN tinh  t ON dt.ma_tinh = t.ma_tinh
        LEFT JOIN huyen h ON dt.ma_huyen = h.ma_huyen
        LEFT JOIN xa    x ON dt.ma_xa    = x.ma_xa
        WHERE dt.id = $1 AND dt.status = 1
        LIMIT 1
      `;
      const result = await pool.query(sql, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
  // Lấy theo id
  async getById(id) {
    try {
      const result = await pool.query(
        "SELECT * FROM dieu_tra WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả điều tra theo user
  async getByUser(user_id) {
    try {
      const result = await pool.query(
        "SELECT * FROM dieu_tra WHERE user_id = $1 ORDER BY dtra_date DESC",
        [user_id]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Thêm mới bản ghi
  async create({ ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo }) {
    try {
      const result = await pool.query(
        `INSERT INTO dieu_tra 
        (ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13) RETURNING *`,
        [ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật bản ghi
  async update(id, { ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo }) {
    try {
      const result = await pool.query(
        `UPDATE dieu_tra 
         SET ma_tinh = $1, ma_huyen = $2, ma_xa = $3, so_sau_non = $4, so_cay = $5, 
             dtra_date = $6, user_id = $7, dia_chi_cu_the = $8, loai_cay = $9, duong_kinh_tb = $10,
             tk =$11, khoanh=$12, lo=$13
         WHERE id = $14 RETURNING *`,
        [ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb,tk, khoanh, lo, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  async softDelete(id) {
    try {
      // 1. Lấy bản ghi hiện tại
      const dieutra = await this.getById(id);
      if (!dieutra) return null;

      // 2. Chuyển trạng thái: 1 -> 0, 0 -> 1
      const newStatus = dieutra.status === 1 ? 0 : 1;

      // 3. Update status trong DB
      const result = await pool.query(
        "UPDATE dieu_tra SET status = $1 WHERE id = $2 RETURNING *",
        [newStatus, id]
      );

      return result.rows[0]; // Trả về bản ghi đã update
    } catch (error) {
      throw error;
    }
  },

  // Xóa bản ghi
  async delete(id) {
    try {
      await pool.query("DELETE FROM dieu_tra WHERE id = $1", [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  async search(keyword, ma_tinh = null) {
    try {
      let sql = `
      SELECT dt.*, t.ten_tinh, h.ten_huyen, x.ten_xa
      FROM dieu_tra dt
      LEFT JOIN tinh  t ON dt.ma_tinh = t.ma_tinh
      LEFT JOIN huyen h ON dt.ma_huyen = h.ma_huyen
      LEFT JOIN xa    x ON dt.ma_xa    = x.ma_xa
      WHERE dt.status = 1
        AND (
          dt.dia_chi_cu_the ILIKE '%' || $1 || '%'
          OR t.ten_tinh     ILIKE '%' || $1 || '%'
          OR h.ten_huyen    ILIKE '%' || $1 || '%'
          OR x.ten_xa       ILIKE '%' || $1 || '%'
        )
    `;

      const values = [keyword];

      // Nếu có ma_tinh, thêm điều kiện
      if (ma_tinh) {
        sql += ` AND dt.ma_tinh = $2`;
        values.push(ma_tinh);
      }

      sql += ` ORDER BY dt.dtra_date DESC`;

      const result = await pool.query(sql, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = DieuTra;
