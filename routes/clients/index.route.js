
const route = require('express').Router();
const homeRouter = require(`./home.route`);
const authMiddleware = require("../../middlewares/clients/auth.middlewares");

route.use('/', authMiddleware.verifyToken, homeRouter)


module.exports = route;