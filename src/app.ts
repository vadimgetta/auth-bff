import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import { errorHandler } from "./middlewares/error-handler";
import todoRouter from "./routes/todo";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/auth";
import authRouter from "./routes/auth";

const { PORT, MONGO_URL } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(authRouter);

app.use(authMiddleware);

app.use(userRouter);
app.use(todoRouter);

app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log("Started on", PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
