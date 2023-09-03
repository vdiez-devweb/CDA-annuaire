import mongoose from "mongoose";

// const mongoOpts = { //https://mongoosejs.com/docs/5.x/docs/connections.html
//     reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//     reconnectInterval: 100, // Reconnect every 100ms
//   };

const connectDB = async () => {
    try {
        let result = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
        // console.log(result);
        return result;
    } catch(error) {
        console.log("Error to connect with DB", error);
        return "";
    }
};

export default connectDB;