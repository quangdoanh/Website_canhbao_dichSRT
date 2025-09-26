const pool = require("../config/database");
const Sauromthong_6tinhModel = {
  async findTop20ByDienTich(matinh = null, mahuyen = null) {
    const conditions = [];
    const params = [];

    // Nếu có tỉnh
    if (matinh !== null) {
      params.push(matinh);
      conditions.push(`matinh = $${params.length}`);
    }

    // Nếu có huyện
    if (mahuyen !== null) {
      params.push(mahuyen);
      conditions.push(`mahuyen = $${params.length}`);
    }

    // Ghép query
    let query = `
    SELECT *
    FROM public."sauromthong_6tinh_web"
    ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}
    ORDER BY dtich DESC
    LIMIT 20
  `;

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findByMaTinh(matinh, skip = 0, limit = 15) {
    try {
      const query = `
            SELECT * 
            FROM public.sauromthong_6tinh_web
            WHERE matinh = $1
            LIMIT $2
            OFFSET $3
        `;
      const values = [matinh, limit, skip];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    const query = `
      SELECT * 
      FROM public."Sauromthong_6tinh"
      WHERE id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Trả về 1 object thay vì mảng
  },
  async deletewebById(id) {
    const query = `
      DELETE FROM public.sauromthong_6tinh_web
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rowCount; // Trả về số bản ghi bị xóa
  },
  async updatePhanCapById(id, phancapValue) {
    const query = `
      UPDATE public."Sauromthong_6tinh"
      SET phancap = $1
      WHERE id = $2
    `;
    const result = await pool.query(query, [phancapValue, id]);
    return result.rowCount; // số bản ghi đã update
  },
  async getAllByMaTinh(matinh) {
    try {
      const query = `
            SELECT * 
            FROM public.sauromthong_6tinh_web
            WHERE matinh = $1
        `;
      const values = [matinh];
      const result = await pool.query(query, values);
      return result.rows; // trả về tất cả record theo matinh
    } catch (error) {
      throw error;
    }
  },
  //
  async countAll(filters = {}) {
    const values = [];
    const conditions = [];
    let index = 1;

    if (filters.ma_tinh) {
      conditions.push(`matinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }

    if (filters.ma_huyen) {
      conditions.push(`mahuyen = $${index}`);
      values.push(filters.ma_huyen);
      index++;
    }

    if (filters.ma_xa) {
      conditions.push(`maxa = $${index}`);
      values.push(filters.ma_xa);
      index++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `SELECT COUNT(*) AS total FROM public."Sauromthong_6tinh" ${whereClause}`;
    const result = await pool.query(sql, values);
    return parseInt(result.rows[0].total, 10);
  },

  async getAllWithPagination(limit, offset, filters = {}) {
    const values = [];
    const conditions = [];
    let index = 1;

    if (filters.ma_tinh) {
      conditions.push(`matinh = $${index}`);
      values.push(filters.ma_tinh);
      index++;
    }

    if (filters.ma_huyen) {
      conditions.push(`mahuyen = $${index}`);
      values.push(filters.ma_huyen);
      index++;
    }

    if (filters.ma_xa) {
      conditions.push(`maxa = $${index}`);
      values.push(filters.ma_xa);
      index++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
    SELECT *
    FROM public."Sauromthong_6tinh"
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${index} OFFSET $${index + 1}
  `;

    values.push(limit, offset);

    const result = await pool.query(sql, values);
    return result.rows;
  },
};
module.exports = Sauromthong_6tinhModel;
