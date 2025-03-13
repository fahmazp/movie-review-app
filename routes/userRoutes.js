import express from 'express'
import { userLogin, userLogout, userProfile, userSignup, userUpdateProfile } from '../controllers/userControllers.js';
import { authUser } from '../middlewares/authUser.js';
const router = express.Router()

// signup
router.post("/signup",userSignup)

//login
router.put("/login",userLogin);

//profile-view
router.get("/profile",authUser,userProfile);

//profile-edit
router.put("/profile-update",authUser,userUpdateProfile);

//profile-deactivate
router.put("/deactivate");

//deactivate-user
// router.put("/deactivate-user/:userId");

//delete-accnt
router.delete("/delete-account");

//logout
router.get("/logout",userLogout);

//check-user
router.get("/check-user");

//password-forgot
//password-change
//address update

export { router as userRouter };