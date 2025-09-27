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
  async findTop20_Defore_ByDienTich() {
    const query = `
          SELECT *
          FROM public.srt_defor_forest_map
          ORDER BY dtich DESC, acqui_date DESC
          LIMIT 20
      `;

    const result = await pool.query(query);
    return result.rows;
  },

  async findTop20_Degrad_ByDienTich() {
    const query = `
          SELECT *
          FROM public.srt_degrad_forest_map
          ORDER BY dtich DESC, acqui_date DESC
          LIMIT 20
      `;

    const result = await pool.query(query);
    return result.rows;
  },
  async findTop20_Canh_Bao(muc_ah = 100) {
    const query = `
        SELECT *
        FROM public.cb_srt_map
        WHERE muc_ah = $1
        ORDER BY so_ngay_con_lai
        LIMIT 20
    `;
    const result = await pool.query(query, [muc_ah]);
    return result.rows;
  },

  /* ==================
      END MAP
     ==================*/

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
  async getAll_Defore(status) {
    try {
      // Khởi tạo mảng điều kiện
      let conditions = ['defor_ha IS NOT NULL'];
      const values = [];

      // Nếu truyền status, thêm điều kiện
      if (status === 0 || status === 1) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      // Tạo câu query
      const query = `
      SELECT *
      FROM public.srt_degrad
      WHERE ${conditions.join(' AND ')};
    `;

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  async getAll_Defore_Condition(skip = 0, limit = 15, status) {
    try {
      let conditions = ['defor_ha IS NOT NULL'];
      const values = [];

      // Nếu truyền status, thêm điều kiện
      if (status === 0 || status === 1) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      // Thêm limit và offset vào values
      values.push(limit);
      values.push(skip);

      const query = `
      SELECT *
      FROM public.srt_degrad
      WHERE ${conditions.join(' AND ')}
      ORDER BY defor_ha DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length};
    `;

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(id, status) {
    const query = `
        UPDATE public.srt_degrad
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0] || null;
  },
  async updateStatusMultiByIds(ids, status) {
    if (!Array.isArray(ids) || ids.length === 0) return false;

    const query = `
        UPDATE public.srt_degrad
        SET status = $1
        WHERE id = ANY($2::int[])
      `;
    await pool.query(query, [status, ids]);
    return true;
  },
  async findById_Defor_Degrad(id) {
    const query = `SELECT * FROM public.srt_degrad WHERE id = $1 LIMIT 1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
  //Degrad
  async getAll_Degrad(status) {
    try {
      // Khởi tạo mảng điều kiện
      let conditions = ['degrad_ha IS NOT NULL'];
      const values = [];

      // Nếu truyền status, thêm điều kiện
      if (status === 0 || status === 1) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      // Tạo câu query
      const query = `
      SELECT *
      FROM public.srt_degrad
      WHERE ${conditions.join(' AND ')};
    `;

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  async getAll_Degrad_Condition(skip = 0, limit = 15, status) {
    try {
      let conditions = ['degrad_ha IS NOT NULL'];
      const values = [];

      // Nếu truyền status, thêm điều kiện
      if (status === 0 || status === 1) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      // Thêm limit và offset vào values
      values.push(limit);
      values.push(skip);

      const query = `
      SELECT *
      FROM public.srt_degrad
      WHERE ${conditions.join(' AND ')}
      ORDER BY degrad_ha DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length};
    `;

      const result = await pool.query(query, values);
      return result.rows;
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

    // Điều kiện fix cứng
    if (filters.muc_ah != null) {
      conditions.push(`muc_ah = $${index}`);
      values.push(filters.muc_ah);
      index++;
    } else {
      conditions.push(`muc_ah >= 50`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `SELECT COUNT(*) AS total FROM public.cb_srt_map ${whereClause}`;
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
    
    // Điều kiện fix cứng
    if (filters.muc_ah != null) {
      conditions.push(`muc_ah = $${index}`);
      values.push(filters.muc_ah);
      index++;
    } else {
      conditions.push(`muc_ah >= 50`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT *
      FROM public.cb_srt_map
      ${whereClause}
      ORDER BY muc_ah DESC, so_ngay_con_lai ASC
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(sql, values);
    return result.rows;
  },
  async findByIdView(id) {
    const query = `
      SELECT * 
      FROM public."cb_srt_map"
      WHERE pk = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Trả về 1 object thay vì mảng
  },
};
module.exports = Sauromthong_6tinhModel;
