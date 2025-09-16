const router = require('express').Router();
const accountRoutes = require('./account.route');
const dashboardRoutes = require('./dashboard.route');
const adminRoutes = require('./admin.route');
const roleRoutes = require('./role.route');
// const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

router.use((req, res, next)=> {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.use('/account', accountRoutes);
router.use('/dashboard',authMiddleware.verifyToken ,dashboardRoutes);
router.use('/account-admin',authMiddleware.verifyToken ,adminRoutes);
router.use('/role',authMiddleware.verifyToken ,roleRoutes);



// router.use('/user',authMiddleware.verifyToken, userRoutes);
// router.get('*',authMiddleware.verifyToken, (req, res) => {
//     res.render("admin/pages/error-404", {
//       pageTitle: "404 Not Found"
//     })
//   })
  
module.exports = router;