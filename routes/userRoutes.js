import express from 'express'
import { userLogin, userSignup } from '../controllers/userControllers.js';
const router = express.Router()

// signup
router.post("/signup",userSignup)

//login
router.put("/login",userLogin);

//profile-view
router.get("/profile");

//profile-edit
router.put("/profile-update");

//profile-deactivate
router.put("/deactivate");

//deactivate-user
// router.put("/deactivate-user/:userId");

//delete-accnt
router.delete("/delete-account");

//logout
router.get("/logout");

//check-user
router.get("/check-user");

//password-forgot
//password-change
//address update

export { router as userRouter };