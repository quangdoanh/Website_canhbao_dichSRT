const pool = require("../config/database");

const Benhhai_lakeoModel = {
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
            FROM public."benhhaikeo_8tinh_web"
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
            FROM public.bhk_degrad_forest_map
            ORDER BY dtich DESC, acqui_date DESC
            LIMIT 20
        `;

        const result = await pool.query(query);
        return result.rows;
    },

    async findTop20_Degrad_ByDienTich() {
        const query = `
            SELECT *
            FROM public.bhk_degrad_forest_map
            ORDER BY dtich DESC, acqui_date DESC
            LIMIT 20
        `;

        const result = await pool.query(query);
        return result.rows;
    },
    async findByMaTinh(matinh, skip = 0, limit = 15) {
        try {
            const query = `
      SELECT * 
      FROM public."benhhaikeo_8tinh_web"
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
    FROM public."benhhaikeo_8tinh_web"
    WHERE id = $1
    LIMIT 1
  `;
        const result = await pool.query(query, [id]);
        return result.rows[0]; // Trả về 1 object thay vì mảng
    },

    async deletewebById(id) {
        const query = `
    DELETE FROM public."benhhaikeo_8tinh_web"
    WHERE id = $1
  `;
        const result = await pool.query(query, [id]);
        return result.rowCount; // Trả về số bản ghi bị xóa
    },

    async updatePhanCapById(id, phancapValue) {
        const query = `
    UPDATE public."benhhaikeo_8tinh_web"
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
      FROM public."benhhaikeo_8tinh_web"
      WHERE matinh = $1
    `;
            const values = [matinh];
            const result = await pool.query(query, values);
            return result.rows; // trả về tất cả record theo matinh
        } catch (error) {
            throw error;
        }
    },

    async getAll_Defore(status, ma_tinh = null, ma_huyen = null, ma_xa = null) {
        try {
            // Khởi tạo mảng điều kiện
            let conditions = ['defor_ha IS NOT NULL'];
            const values = [];

            // Nếu truyền status, thêm điều kiện
            if (status === 0 || status === 1) {
                values.push(status);
                conditions.push(`status = $${values.length}`);
            }

            // Nếu truyền ma_tinh
            if (ma_tinh) {
                values.push(ma_tinh);
                conditions.push(`ma_tinh = $${values.length}`);
            }

            // Nếu truyền ma_huyen
            if (ma_huyen) {
                values.push(ma_huyen);
                conditions.push(`ma_huyen = $${values.length}`);
            }

            // Nếu truyền ma_xa
            if (ma_xa) {
                values.push(ma_xa);
                conditions.push(`ma_xa = $${values.length}`);
            }

            // Tạo câu query
            const query = `
          SELECT *
          FROM public.bhk_degrad
          WHERE ${conditions.join(' AND ')};
        `;

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    async getAll_Defore_Condition(skip = 0, limit = 15, status = null, ma_tinh = null, ma_huyen = null, ma_xa = null) {
        try {
            // Điều kiện mặc định
            let conditions = ['defor_ha IS NOT NULL'];
            const values = [];

            // Nếu truyền status
            if (status === 0 || status === 1) {
                values.push(status);
                conditions.push(`status = $${values.length}`);
            }

            // Nếu truyền ma_tinh
            if (ma_tinh) {
                values.push(ma_tinh);
                conditions.push(`ma_tinh = $${values.length}`);
            }

            // Nếu truyền ma_huyen
            if (ma_huyen) {
                values.push(ma_huyen);
                conditions.push(`ma_huyen = $${values.length}`);
            }

            // Nếu truyền ma_xa
            if (ma_xa) {
                values.push(ma_xa);
                conditions.push(`ma_xa = $${values.length}`);
            }

            // Thêm limit và offset
            values.push(limit);
            values.push(skip);

            const query = `
          SELECT *
          FROM public.bhk_degrad
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
                UPDATE public.bhk_degrad
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
                UPDATE public.bhk_degrad
                SET status = $1
                WHERE id = ANY($2::int[])
              `;
        await pool.query(query, [status, ids]);
        return true;
    },
    async findById_Defor_Degrad(id) {
        const query = `SELECT * FROM public.bhk_degrad WHERE id = $1 LIMIT 1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },
    //Degrad
    async getAll_Degrad(status = null, ma_tinh = null, ma_huyen = null, ma_xa = null) {
        try {
            // Khởi tạo mảng điều kiện
            let conditions = ['degrad_ha IS NOT NULL'];
            const values = [];

            // Nếu truyền status, thêm điều kiện
            if (status === 0 || status === 1) {
                values.push(status);
                conditions.push(`status = $${values.length}`);
            }

            // Nếu truyền ma_tinh
            if (ma_tinh) {
                values.push(ma_tinh);
                conditions.push(`ma_tinh = $${values.length}`);
            }

            // Nếu truyền ma_huyen
            if (ma_huyen) {
                values.push(ma_huyen);
                conditions.push(`ma_huyen = $${values.length}`);
            }

            // Nếu truyền ma_xa
            if (ma_xa) {
                values.push(ma_xa);
                conditions.push(`ma_xa = $${values.length}`);
            }

            // Tạo câu query
            const query = `
          SELECT *
          FROM public.bhk_degrad
          WHERE ${conditions.join(' AND ')};
        `;

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    async getAll_Degrad_Condition(skip = 0, limit = 15, status, ma_tinh, ma_huyen, ma_xa) {
        try {
            const conditions = ['degrad_ha IS NOT NULL'];
            const values = [];

            if (status === 0 || status === 1) { values.push(status); conditions.push(`status = $${values.length}`); }
            if (ma_tinh) { values.push(ma_tinh); conditions.push(`ma_tinh = $${values.length}`); }
            if (ma_huyen) { values.push(ma_huyen); conditions.push(`ma_huyen = $${values.length}`); }
            if (ma_xa) { values.push(ma_xa); conditions.push(`ma_xa = $${values.length}`); }

            values.push(limit, skip);

            const query = `SELECT * FROM public.bhk_degrad WHERE ${conditions.join(' AND ')} ORDER BY degrad_ha DESC LIMIT $${values.length - 1} OFFSET $${values.length};`;
            return (await pool.query(query, values)).rows;
        } catch (error) { throw error; }
    },

};

module.exports = Benhhai_lakeoModel;
