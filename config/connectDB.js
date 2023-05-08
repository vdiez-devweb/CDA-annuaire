import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");        
    } catch(error) {
        console.log("Error to connect with DB", error);
    }
};

export default connectDB;