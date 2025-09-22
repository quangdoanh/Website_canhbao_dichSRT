const pool = require("../config/database");

const DieuTra = {
  // Lấy tất cả bản ghi
  async getAllByMaTinh(ma_tinh) {
    try {
      const query = `
      SELECT *
      FROM dieu_tra
      WHERE status = 1 AND ma_tinh = $1
      ORDER BY dtra_date DESC
    `;
      const values = [ma_tinh];
      const result = await pool.query(query, values);
      return result.rows;
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
  async create({ ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb }) {
    try {
      const result = await pool.query(
        `INSERT INTO dieu_tra 
        (ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) RETURNING *`,
        [ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật bản ghi
  async update(id, { ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb }) {
    try {
      const result = await pool.query(
        `UPDATE dieu_tra 
         SET ma_tinh = $1, ma_huyen = $2, ma_xa = $3, so_sau_non = $4, so_cay = $5, 
             dtra_date = $6, user_id = $7, dia_chi_cu_the = $8, loai_cay = $9, duong_kinh_tb = $10
         WHERE id = $11 RETURNING *`,
        [ma_tinh, ma_huyen, ma_xa, so_sau_non, so_cay, dtra_date, user_id, dia_chi_cu_the, loai_cay, duong_kinh_tb, id]
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
