import express from "express";
import { PrismaClient, User } from "@prisma/client";
import { config } from "dotenv";
config();
import AuthenticationRouter from "./routes/AuthenticationRouter";
import AccountRouter from "./routes/AccountRouter";
import CDNRouter from "./routes/CDNRouter";
import cookieParser from "cookie-parser";
import http from "http";
import {Server} from "socket.io";
import WSRouter from "./routes/WSRouter";
import { Verifications } from "./schemas/TypeInterfaces";
import ChannelRouter from "./routes/ChannelRouter";
import UsersRouter from "./routes/UsersRouter";
import DmsRouter from "./routes/DmsRouter";
import InvitesRouter from "./routes/InvitesRouter";
import cors from "cors";

const prisma = new PrismaClient();
prisma.$connect()
  .then(() => {
    console.log("[PRISMA] Connected to the database");
  })
  .catch((error) => {
    console.error("[PRISMA] Failed to connect to the database:", error);
    process.exit(1);
  });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
app.set("ws", io);
app.set("prisma", prisma);
app.set("pendingVerifications", new Map<string, Verifications>());
app.set("userCache", new Map<string, User>());
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
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
app.use("/api/channels/", ChannelRouter);
app.use("/api/users/", UsersRouter);
app.use("/api/dms/", DmsRouter);
app.use("/api/invites/", InvitesRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
WSRouter(io,app);
server.listen(8080, () => {
  console.log(`[SERVER] STARTED`);
});
