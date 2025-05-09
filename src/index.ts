import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnect from "./config/dbConfig";
dbConnect();
import rootRouter from "./routes";

const app = express();
const port = process.env.SERVER_PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("healty server");
});
app.use("/api/v1/", rootRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
