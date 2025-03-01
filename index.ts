import express from "express";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config();
import AuthenticationRouter from "./routes/AuthenticationRouter";
const prisma = new PrismaClient();
const app = express();
app.set("prisma", prisma);
app.set("pendingRegistrations", new Map());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});
app.use("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
app.use("/api/auth/", AuthenticationRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.listen(8080, () => {
  console.log(`[SERVER] STARTED`);
});
