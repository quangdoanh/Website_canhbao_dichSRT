const router = require('express').Router();
const accountRoutes = require('./account.route');
const dashboardRoutes = require('./dashboard.route');
const adminRoutes = require('./admin.route');
const sauromthongRoutes = require('./sauromthong.route')
const sauhailakeoRotues = require('./sauhailakeo.route')
const userRoutes = require("./user.route");
const roleRoutes = require('./role.route');
const aboutRoutes = require('./about.route');
const contactRoutes = require('./contact.route');
const benhhaikeoRoutes = require('./benhhailakeo.route')
// const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.use('/benhhailakeo', authMiddleware.verifyToken, benhhaikeoRoutes);
router.use('/sauromthong', authMiddleware.verifyToken, sauromthongRoutes);
router.use('/sauhailakeo', authMiddleware.verifyToken, sauhailakeoRotues);
router.use('/account', accountRoutes);
router.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes);
// router.use('/account-admin', authMiddleware.verifyToken, adminRoutes);
router.use('/user', authMiddleware.verifyToken, userRoutes);
router.use('/role', authMiddleware.verifyToken, roleRoutes);
router.use('/about', authMiddleware.verifyToken, aboutRoutes);
router.use('/contact', authMiddleware.verifyToken, contactRoutes);



// router.use('/user',authMiddleware.verifyToken, userRoutes);
// router.get('*',authMiddleware.verifyToken, (req, res) => {
//     res.render("admin/pages/error-404", {
//       pageTitle: "404 Not Found"
//     })
//   })

module.exports = router;