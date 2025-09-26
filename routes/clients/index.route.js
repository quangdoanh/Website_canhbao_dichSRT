
const route = require('express').Router();
const homeRouter = require(`./home.route`);
const contactRouter = require('./contact.route');
const aboutRouter = require('./about.route');
const faqRouter = require('./faq.routes');
const mapCanhBaoRouter = require('./mapcanhbao.route');
const mapGiamSatRouter = require('./mapgiamsat.route')

const authMiddleware = require("../../middlewares/clients/auth.middlewares");

route.use('/', homeRouter);
route.use('/contact', contactRouter);
route.use('/about-us', aboutRouter);
route.use('/faq', faqRouter);
route.use('/bandocanhbao', mapCanhBaoRouter);
route.use('/bandogiamsat', mapGiamSatRouter);

module.exports = route;