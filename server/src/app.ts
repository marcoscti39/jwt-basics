import express from "express";
import { connectToDataBase } from "./database/connect";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./database/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

const PORT = 3000;

connectToDataBase();

app.post("/login", async (req, res) => {
  const user = await User.find({ name: req.body?.name });

  if (user.length === 0) {
    await User.create({ name: req.body.name, password: req.body.password });
    const token = jwt.sign(
      {
        name: req.body.name,
        content: `Here is Your Authorized data, your luck number is ${Math.floor(
          Math.random() * 30
        )}`,
      },
      process.env.ACCESS_KEY!,
      {
        expiresIn: "15s",
      }
    );
    res.json({
      message: "User Created!",
      type: "success",
      accessKey: token,
    });
    return;
  }

  if (user[0].password !== req.body?.password) {
    res.json({ message: "Wrong Password Bro", type: "error" });
    return;
  }

  const token = jwt.sign(
    {
      name: req.body.name,
      content: `Here is Your Authorized data, your luck number is ${Math.floor(
        Math.random() * 30
      )}`,
    },
    process.env.ACCESS_KEY!,
    {
      expiresIn: "15s",
    }
  );

  res.json({
    message: "User Logged!",
    type: "success",
    accessKey: token,
  });
});

app.get("/premium-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ message: "No Token Provided", type: "error" });

  jwt.verify(token, process.env.ACCESS_KEY!, (err, decoded) => {
    if (err) {
      res.json({
        message: "You Are Not Authorized for this action",
        type: "error",
      });
      return;
    }

    res.json({
      message: "premium data provided",
      type: "success",
      premiumData: decoded,
    });
  });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
