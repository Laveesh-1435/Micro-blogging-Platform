import mongoose from "mongoose";

// const connectMongoDB = async () => {
//     try{
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`mongoDB connected : ${conn.connection.host}`)
//     }catch(error){
//         console.error(`error connection to mongoDB: ${error.message}`);
//         process.exit(1);
//     }
// }

const connectMongoDB = async () => {
    try {
        console.log("Attempting to connect to:", process.env.MONGO_URI); // Add this
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoDB connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`error connecting to mongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectMongoDB;