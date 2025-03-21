import mongoose from "mongoose";

const mongoUrl = process.env.DATABASE_URL!;

export default async function dbConnect() {
  try {
    mongoose.connect(mongoUrl).then(() => {
      console.log(`MongoDB connected`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
