import jwt from 'jsonwebtoken';

export const generateToken = (id,role)=>{
    try {
        
        const token = jwt.sign({id,role},process.env.JWT_SECRETKEY, { expiresIn: "7d" })
        return token;

    } catch (error) {
        console.log("JWT Generation Error:", error);
        return null;
    }   
}