const pool = require("../config/database");
const Sauromthong_6tinhModel = {
  async findTop20ByDienTich() {
    const query = `
    SELECT *
    FROM public."sauromthong_6tinh_web"
    ORDER BY dtich DESC
    LIMIT 20
  `;
    const result = await pool.query(query);
    return result.rows; // trả về mảng 20 bản ghi
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
      FROM public.sauromthong_6tinh_web
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
  }

}
module.exports = Sauromthong_6tinhModel;