import express from 'express'
import { authAdmin } from '../middlewares/authAdmin.js';
import { blockUser, deleteUser, getAllUsers, unblockUser } from '../controllers/adminController.js';

// const router = express.Router()
// // Example protected route for admins only
// // router.get("/admin/profile", authUser, authAdmin, (req, res) => {
// //     res.json({ message: "Welcome, Admin!" });
// // });

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

router.get("/all-users", authAdmin, getAllUsers);
router.put("/block-user/:userId", authAdmin, blockUser);
router.put("/unblock-user/:userId", authAdmin, unblockUser);
router.delete("/delete-user/:userId", authAdmin, deleteUser);
  

export { router as adminRouter }
