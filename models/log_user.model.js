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
            ORDER BY id DESC
        `;
        const { rows } = await pool.query(query);
        return rows; // mảng các bản ghi
    },

    // async getLimit(skip = 0, limit = 20) {
    //     try {
    //         const query = `
    //   SELECT * 
    //   FROM public.log_user
    //   ORDER BY id DESC
    //   LIMIT $1
    //   OFFSET $2
    // `;
    //         const values = [limit, skip];
    //         const { rows } = await pool.query(query, values);
    //         return rows;
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // },

    async FilterLogUser({ method, name, startDate, endDate, skip = 0, limit = 20 }) {
        try {
            let query = `
      SELECT * 
      FROM public.log_user
      WHERE 1=1
    `;
            const values = [];
            let index = 1;

            // thêm điều kiện nếu có method
            if (method) {
                query += ` AND method = $${index++}`;
                values.push(method);
            }

            // thêm điều kiện nếu có name
            if (name) {
                query += ` AND "user" = $${index++}`;   // cột user nên để trong "" vì là từ khóa
                values.push(name);
            }

            // thêm điều kiện nếu có startDate
            if (startDate) {
                query += ` AND time >= $${index++}`;
                values.push(startDate);
            }

            // thêm điều kiện nếu có endDate
            if (endDate) {
                query += ` AND time <= $${index++}`;
                values.push(endDate);
            }

            // cuối cùng ORDER BY + LIMIT OFFSET
            query += ` ORDER BY id DESC LIMIT $${index++} OFFSET $${index++}`;
            values.push(limit, skip);

            const { rows } = await pool.query(query, values);
            return rows;
        } catch (error) {
            console.error("Error getLimit:", error);
            throw error;
        }
    }



};

module.exports = LogUserModel;
