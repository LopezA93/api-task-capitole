import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(process.env.MONGODB_URI);
};

export default connectionMongoDB;
