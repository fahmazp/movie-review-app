import jwt from 'jsonwebtoken';

export const authAdmin = (req,res,next) => {

    try {
        
        // collect token from cookies
        const {token} = req.cookies
        
        if (!token) {
            return res.status(401).json({message: 'Unauthorized user'})    
        }

        // decoding token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

        if (!decodedToken) {
            return res.status(401).json({message: 'Unauthorized user'})    
        }

        // checking the role
        if (decodedToken.role !="admin") {
            return res.status(401).json({message: 'Unauthorized user:Access for admins only'})    
        }

        req.user = decodedToken

        // passing to next middleware
        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'})
    }

}