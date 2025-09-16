
const route = require('express').Router();
const homeRouter = require(`./home.route`);

route.use('/', homeRouter)


module.exports = route;