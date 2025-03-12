import { connect } from 'mongoose';

export const connectDB = async() => {
    try {
        const response = await connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);       
    }
}