import express from 'express'

// const router = express.Router()
// // Example protected route for admins only
// // router.get("/admin/profile", authUser, authAdmin, (req, res) => {
// //     res.json({ message: "Welcome, Admin!" });
// // });

// router.get('/logout', (req, res) => {
//     req.session.admin = null; // Clear the admin session
//     res.clearCookie('token'); // (only if you are using a cookie named adminToken)
//     res.status(200).json({ success: true, message: "Admin logged out successfully" });
//   });
// export { router as adminRouter }

const router = express.Router()
router.get('/check-auth', (req, res) => {
    const token = req.cookies.token;
    
    if (token) {
      // Ideally, verify JWT token properly here
      res.json({ isAuthenticated: true });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

export { router as adminRouter }
