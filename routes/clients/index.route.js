
const route = require('express').Router();
const homeRouter = require(`./home.route`);
const contactRouter = require('./contact.route');
const aboutRouter = require('./about.route');

route.use('/', homeRouter)
route.use('/contact',contactRouter)
route.use('/about-us',aboutRouter)


module.exports = route;