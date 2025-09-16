const pool = require("../config/database");
const HaTinhModel = {

    async insert(geometry) {
        const query = `
      INSERT INTO "public"."HaTinh_SRT_wgs84" (geom)
      VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4326))
      RETURNING pk
    `;
        const { rows } = await pool.query(query, [JSON.stringify(geometry)]);
        return rows[0] ? rows[0].pk : null;
    },


    async delete(pk) {
        const query = `DELETE FROM "public"."HaTinh_SRT_wgs84" WHERE pk = $1`;
        const { rowCount } = await pool.query(query, [pk]);
        return rowCount > 0; // trả về true nếu xóa thành công
    }

}

module.exports = HaTinhModel;