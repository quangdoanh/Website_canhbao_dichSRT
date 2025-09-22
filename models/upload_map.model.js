const pool = require("../config/database");

const uploadMap = {
    async getAll(matinh) {
        try {
            const query = `
            SELECT *
            FROM public.uploadmap
            WHERE ma_tinh = $1
            ORDER BY id ASC
            `;
            const values = [matinh];  // matinh lấy từ req.params hoặc req.query
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    async create({ thongtin, loaibando, file, mota, ma_tinh }) {
        try {
            const query = `
            INSERT INTO public.uploadmap (thongtin, loaibando, file, mota, ma_tinh)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
            const values = [thongtin, loaibando, file, mota, ma_tinh];
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
    async updateById(id, { thongtin, loaibando, file, mota }) {
        try {
            const query = `
            UPDATE public.uploadmap
            SET thongtin = $2,
                loaibando = $3,
                file = $4,
                mota = $5
            WHERE id = $1
            RETURNING *;
        `;
            const values = [id, thongtin, loaibando, file, mota];
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
    }



}
module.exports = uploadMap;