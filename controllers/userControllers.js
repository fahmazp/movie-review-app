import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const userSignup = async (req,res,next) => {
    try {
        
        // collect user data
        const {name,email,password,confirmPassword,mobile,profiePic}=req.body;

        //data validation
        if (!name || !email || !password || !confirmPassword || !mobile) {
            return res.status(400).json({message:"Please fill in all required fields"})
        }

        // check if user already exists
        const userExist = await User.findOne({email})
        if (userExist) {
            return res.status(400).json({message:"User already exists!"})
        }

        //compare with confirm pswd
        if (password !== confirmPassword) {
            return res.status(400).json({message:"Passwords didnot match"})
        }

        //hash pswd
        const hashedpswd = bcrypt.hashSync(password, 10);


        const newUser = new User({ name, email, password: hashedpswd, mobile, profiePic })
        await newUser.save()

        //generate token using id and role
        const token = generateToken(newUser._id, "user")
        res.cookie("token", token)

        res.json({data:newUser, message:"Sign up success. User created"})

    } catch (error) {
       console.log(error);
       res.status(500).json({message: 'Internal Server Error'})
    }
}

export const userLogin = async (req,res,next) => {
    try {
        
        // collect user data
        const {email,password}=req.body;

        //data validation
        if (!email || !password) {
            return res.status(400).json({message:"Please fill in all required fields"})
        }

        // check if existing user
        const userExist = await User.findOne({email})
        if (!userExist) {
            return res.status(404).json({message:"User does not exist!"})
        }

        // match password with db pswd
        const pswdMatch = bcrypt.compareSync(password, userExist.password); 

        if (!pswdMatch) {
            return res.status(400).json({message:"Invalid login credentials"})
        }

        // check user is Active
        if (!userExist.isActive) {
            return res.status(401).json({message:"User account is deactivated!"})
        }

        //generate token using id and role
        const token = generateToken(userExist._id, "user")
        res.cookie("token", token)

        // deleting pswd from userExist object(to hide password from the frontend)
        delete userExist._doc.password;

        res.json({data:userExist, message:"Login success"})

    } catch (error) {
       res.status(500).json({message: 'Internal Server Error'})
    }
}

export const userProfile = async (req,res,next) => {
    try {        

        //fetching userid and storing it
        const userId = req.user.id
        const userData = await User.findById(userId)

        res.json({data: userData, message:"User profile fetched"})

    } catch (error) {
       res.status(500).json({message: 'Internal Server Error'})
    }
}

export const userUpdateProfile = async (req,res,next) => {
    try {        
        
        const { name,email,password,confirmPassword,mobile,profiePic }=req.body;

        //fetching userid and storing it
        const userId = req.user.id
        const userData = await User.findByIdAndUpdate(
            userId,
            {name,email,password,confirmPassword,mobile,profiePic},
            { new:true }
        );

        res.json({data: userData, message:"User profile updated"})

    } catch (error) {
       res.status(500).json({message: 'Internal Server Error'})
    }
}

export const userLogout = async (req,res,next) => {
    try {        
        
        res.clearCookie("token");
        res.json({message:"You have been logged out!"})

    } catch (error) {
       res.status(500).json({message: 'Internal Server Error'})
    }
}