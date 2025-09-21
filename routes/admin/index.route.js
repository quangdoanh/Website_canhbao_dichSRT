const router = require('express').Router();
const accountRoutes = require('./account.route');
const dashboardRoutes = require('./dashboard.route');
const adminRoutes = require('./admin.route');
const sauromthongRoutes = require('./sauromthong.route')
const userRoutes = require("./user.route");
const roleRoutes = require('./role.route');
const aboutRoutes = require('./about.route');
const contactRoutes = require('./contact.route');
// const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.use('/sauromthong', sauromthongRoutes);
router.use('/account', accountRoutes);
router.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes);
router.use('/account-admin', authMiddleware.verifyToken, adminRoutes);
router.use('/user', userRoutes);
router.use('/role', authMiddleware.verifyToken, roleRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);



// router.use('/user',authMiddleware.verifyToken, userRoutes);
// router.get('*',authMiddleware.verifyToken, (req, res) => {
//     res.render("admin/pages/error-404", {
//       pageTitle: "404 Not Found"
//     })
//   })

module.exports = router;