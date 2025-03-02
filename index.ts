import express from "express";
import { PrismaClient, User } from "@prisma/client";
import { config } from "dotenv";
config();
import AuthenticationRouter from "./routes/AuthenticationRouter";
import AccountRouter from "./routes/AccountRouter";
import CDNRouter from "./routes/CDNRouter";
const prisma = new PrismaClient();
const app = express();
app.set("prisma", prisma);
app.set("pendingVerifications", new Map<string, any>());
app.set("userCache", new Map<string, User>());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
app.use("/cdn/", CDNRouter);
app.use("/api/auth/", AuthenticationRouter);
app.use("/api/account/", AccountRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
app.listen(8080, () => {
  console.log(`[SERVER] STARTED`);
});
