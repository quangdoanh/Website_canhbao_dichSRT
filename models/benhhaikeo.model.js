const pool = require("../config/database");

const Benhhai_lakeoModel = {
    async findTop20ByDienTich() {
        const query = `
      SELECT *
      FROM public."benhhaikeo_8tinh_web"
      ORDER BY dtich DESC
        LIMIT 20
    `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = Benhhai_lakeoModel;
