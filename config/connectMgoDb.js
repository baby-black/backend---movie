import mongoose from "mongoose";

const ConnectDB = () => {
  mongoose.connect('mongodb://localhost:27017/movie', {
  
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
};

export default ConnectDB;
