import jwt from 'jsonwebtoken';

export const authUser = (req,res,next) => {

    try {
        
        // collect token from cookies
        // console.log('Cookies: ', req.cookies);
        const {token} = req.cookies
        
        if (!token) {
            return res.status(401).json({message: 'Unauthorized user'})    
        }

        // decoding token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
        // console.log(decodedToken, "=========Decoded token");

        if (!decodedToken) {
            return res.status(401).json({message: 'Unauthorized user'})    
        }

        req.user = decodedToken

        // passing to next middleware(here its userprofile)
        next()

    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }

}