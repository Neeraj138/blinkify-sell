import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const D = process.env.DATABASE;
    await mongoose.connect(D);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
