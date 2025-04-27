import express from 'express'
import { checkUser, userLogin, userLogout, userProfile, userSignup, userUpdateProfile } from '../controllers/userControllers.js';
import { authUser } from '../middlewares/authUser.js';
import { upload } from '../middlewares/multer.js';
// import { authAdmin } from '../middlewares/authAdmin.js';
const router = express.Router()

//signup
router.post("/signup",userSignup)

//login
router.put("/login",userLogin);

// Example protected route for admins only
// router.get("/admin/profile", authUser, authAdmin, (req, res) => {
//     res.json({ message: "Welcome, Admin!" });
// });

//profile-view
router.get("/profile",authUser,userProfile);

//profile-edit
router.put("/profile-update", authUser, upload.single("profiePic"), userUpdateProfile);

//profile-deactivate
// router.put("/deactivate");

//deactivate-user
// router.put("/deactivate-user/:userId",authAdmin,userDeactivate);

//delete-accnt
router.delete("/delete-account",authUser);

//logout
router.get("/logout",userLogout);

//check-user
router.get("/check-user",authUser,checkUser);

export { router as userRouter };