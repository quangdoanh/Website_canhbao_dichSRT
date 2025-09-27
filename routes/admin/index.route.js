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
const weatherRouters = require('./weather.route');
const profileRoutes = require('./profile.route');
const UploadMapRoutes = require('./uploadmap.route')
const DieuTraRoutes = require('./dieutra.route')
const DichBenhRoutes = require('./dichbenh.route')
const LocationRoutes = require('./location.route')
// const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");
const { required } = require('joi');

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.use('/dichbenh', authMiddleware.verifyToken, DichBenhRoutes)
router.use('/benhhailakeo', authMiddleware.verifyToken, benhhaikeoRoutes);
router.use('/sauromthong', authMiddleware.verifyToken, sauromthongRoutes);
router.use('/sauhailakeo', authMiddleware.verifyToken, sauhailakeoRotues);
router.use('/map', authMiddleware.verifyToken, UploadMapRoutes)
router.use('/dieutra', authMiddleware.verifyToken, DieuTraRoutes)
router.use('/account', accountRoutes);
router.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes);
// router.use('/account-admin', authMiddleware.verifyToken, adminRoutes);
router.use('/user', authMiddleware.verifyToken, userRoutes);
router.use('/role', authMiddleware.verifyToken, roleRoutes);
router.use('/about', authMiddleware.verifyToken, aboutRoutes);
router.use('/contact', authMiddleware.verifyToken, contactRoutes);
router.use('/weather-data', authMiddleware.verifyToken, weatherRouters);
router.use('/profile', authMiddleware.verifyToken, profileRoutes);
router.use('/location', LocationRoutes);




// router.use('/user',authMiddleware.verifyToken, userRoutes);
// router.get('*',authMiddleware.verifyToken, (req, res) => {
//     res.render("admin/pages/error-404", {
//       pageTitle: "404 Not Found"
//     })
//   })

module.exports = router;