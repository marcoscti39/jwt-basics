import mongoose from "mongoose";

export const connectToDataBase = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_DB_ACCESS!);
  console.log("connected to the database");
};
