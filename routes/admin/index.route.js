const router = require('express').Router();
const accountRoutes = require('./account.route');
const dashboardRoutes = require('./dashboard.route');
// const userRoutes = require("./user.route");

// const authMiddleware = require("../../middlewares/admin/auth.middlewares");

router.use((req, res, next)=> {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.use('/account', accountRoutes);
router.use('/dashboard', dashboardRoutes);



// router.use('/user',authMiddleware.verifyToken, userRoutes);
// router.get('*',authMiddleware.verifyToken, (req, res) => {
//     res.render("admin/pages/error-404", {
//       pageTitle: "404 Not Found"
//     })
//   })
  
module.exports = router;