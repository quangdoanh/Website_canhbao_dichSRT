const pool = require("../config/database");

const WeatherModel = {
  async findById(id) {
    const query = `SELECT * FROM weather_data WHERE id = $1 LIMIT 1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
 // Đếm tổng số bản ghi (có filter)
  async countAll(filters = {}) {
    const values = [];  
    const conditions = [];
    let index = 1;

    if (filters.startDate) {
      conditions.push(`dt.ngay_cap_nhat >= $${index}`);
      values.push(filters.startDate);
      index++;
    }
    if (filters.endDate) {
      conditions.push(`dt.ngay_cap_nhat <= $${index}`);
      values.push(filters.endDate);
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
    if (filters.status) {
      conditions.push(`dt.status = $${index}`);
      values.push(filters.status);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT COUNT(*) AS total FROM weather_data dt ${whereClause}`;

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].total, 10);
  },

  // Lấy dữ liệu phân trang (có filter)
  async getAllWithPagination(limit, offset, filters = {}) {
    const values = [];
    const conditions = [];
    let index = 1;

    if (filters.startDate) {
      conditions.push(`dt.ngay_cap_nhat >= $${index}`);
      values.push(filters.startDate);
      index++;
    }
    if (filters.endDate) {
      conditions.push(`dt.ngay_cap_nhat <= $${index}`);
      values.push(filters.endDate);
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
    if (filters.status) {
      conditions.push(`dt.status = $${index}`);
      values.push(filters.status);
      index++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT dt.*, 
            t.ten_tinh, 
            h.ten_huyen, 
            x.ten_xa
      FROM weather_data dt
      LEFT JOIN tinh  t ON dt.ma_tinh = t.ma_tinh
      LEFT JOIN huyen h ON dt.ma_huyen = h.ma_huyen
      LEFT JOIN xa    x ON dt.ma_xa    = x.ma_xa
      ${whereClause}
      ORDER BY dt.ngay_cap_nhat DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);
    const result = await pool.query(sql, values);
    return result.rows;
  },
  async getByIdWithNames(id) {
    try {
      const sql = `
        SELECT w.*, 
              t.ten_tinh, 
              h.ten_huyen, 
              x.ten_xa
        FROM weather_data w
        LEFT JOIN tinh  t ON w.ma_tinh = t.ma_tinh
        LEFT JOIN huyen h ON w.ma_huyen = h.ma_huyen
        LEFT JOIN xa    x ON w.ma_xa    = x.ma_xa
        WHERE w.id = $1
        LIMIT 1
      `;
      const result = await pool.query(sql, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

   async update(id, data) {
    const fields = Object.keys(data); // Lấy các trường để cập nhật
    const values = Object.values(data); // Lấy giá trị của các trường đó

    if (fields.length === 0) {
      return null; // Nếu không có trường nào để cập nhật
    }

    // Tạo câu lệnh SET động: field1 = $1, field2 = $2 ...
    const setQuery = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    const query = `
      UPDATE weather_data
      SET ${setQuery}, status = 1
      WHERE id = $${fields.length + 1}
      RETURNING *;  -- Trả về dữ liệu sau khi update
    `;

    // Cập nhật vào bảng weather_data và trả về bản ghi đã được cập nhật
    const result = await pool.query(query, [...values, id]);
    return result.rows[0] || null;
  }

};

module.exports = WeatherModel;
