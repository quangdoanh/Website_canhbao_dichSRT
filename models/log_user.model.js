const pool = require("../config/database");

const LogUserModel = {

    // Chèn dữ liệu log, trả về true nếu thành công
    async insert({ user, endpoint, method, purpose }) {
        const query = `
            INSERT INTO "public"."log_user" ("user", endpoint, method, purpose, time)
            VALUES ($1, $2, $3, $4, NOW())
        `;
        const { rowCount } = await pool.query(query, [user, endpoint, method, purpose]);
        return rowCount > 0; // true nếu insert thành công
    },

    // Lấy tất cả dữ liệu trừ cột id
    async getAll() {
        const query = `
            SELECT "user", endpoint, method, purpose, time
            FROM "public"."log_user"
        `;
        const { rows } = await pool.query(query);
        return rows; // mảng các bản ghi
    }

};

module.exports = LogUserModel;
