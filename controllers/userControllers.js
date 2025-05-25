import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

const NODE_ENV = process.env.NODE_ENV

export const userSignup = async (req,res,next) => {
    try {
        
        // collect user data
        const { name,email,password,confirmPassword,mobile,profiePic,role }=req.body;

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
            return res.status(400).json({message:"Passwords does not match"})
        }

        // Assign role (default to "user" if not provided)
        const userRole = role || "user";

        //hash pswd
        const hashedpswd = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedpswd, mobile, profiePic, role: userRole })
        await newUser.save()

        //generate token using id and role
        const token = generateToken(newUser._id, newUser.role)
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({data:newUser, message:"Sign up success. User created"})

    } catch (error) {
       console.log(error);
       res.status(500).json({message: 'Internal Server Error'})
    }
}

export const userLogin = async (req,res,next) => {
    try {
        
        // collect user data from frontend
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
            return res.status(401).json({message:"User account is inactive!"})
        }

        //generate jwt token user id and role
        const token = generateToken(userExist._id, userExist.role)
        
        // storing token
        res.cookie("token", token, {
            path: "/",
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            //httpOnly: NODE_ENV === "production",
             httpOnly: true, // Always set this, even in dev
        });

        // deleting pswd from userExist object(to hide password from the frontend)
        delete userExist._doc.password;

        res.json({data:userExist, message:"User Login success"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

export const userProfile = async (req,res,next) => {
    try {        

        //fetching userid and storing it
        const userId = req.user.id
        const userData = await User.findById(userId).select("-password")

        res.json({data: userData, message:"User profile fetched"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

export const userUpdateProfile = async (req,res,next) => {
    try {
        console.log("REQ FILE:", req.file);
        const { name, email, password, confirmPassword, mobile } = req.body;
        const userId = req.user.id;
    
        const updateData = { name, email, password, confirmPassword, mobile };
    
        // Handle file upload if image exists
        if (req.file) {
            try {
                const result = await cloudinaryInstance.uploader.upload(req.file.path);
                updateData.profiePic = result.secure_url;
        
              } catch (cloudErr) {
                console.error("Cloudinary error:", cloudErr);
                return res.status(500).json({ message: "Cloudinary upload failed" });
              }
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateData,
          { new: true }
        );
    
        res.json({ data: updatedUser, message: "User profile updated" });
      } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
      }
    };


export const userLogout = async (req,res,next) => {
    try {        
        
        res.clearCookie("token",{
            path: "/",
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            // httpOnly: NODE_ENV === "production",
            httpOnly: true,
        })
        res.json({message:"You have been logged out!"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

export const checkUser = async (req,res,next) => {
    try {          
        res.json({message:"Authorized user!"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

