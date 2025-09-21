const pool = require("../config/database");

const Sauhailakeo_5tinhModel = {
    async findTop20ByDienTich() {
        const query = `
      SELECT *
      FROM public."sauhailakeo_5tinh_web"
      ORDER BY dtich DESC
        LIMIT 20
    `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = Sauhailakeo_5tinhModel;
