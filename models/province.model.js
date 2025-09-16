const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const ProvinceModel = {
    async getAll() {
        const query = `
        SELECT *
        FROM province
        ORDER BY id ASC
        `;
        const { rows } = await pool.query(query);
        return rows;
    },


};

module.exports = ProvinceModel;
