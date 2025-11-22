import { PrismaClient, User } from "@prisma/client";
import { Response, Request } from "express";
import { verifyJWT } from "./HashUtils";
import { Socket } from "socket.io";

export async function verifyUser(
  req: Request,
  res: Response
): Promise<User | void> {
  let token = req.cookies?.auth;
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization.trim();
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }
  const data = verifyJWT(token);
  if (!data) {
    res.clearCookie("auth").status(401).json({ error: "Unauthorized" });
    return;
  }
  const prisma = res.app.get("prisma") as PrismaClient;
  let user = res.app.get("userCache").get(data.user_id);
  if (!user)
    user = await prisma.user.findUnique({ where: { user_id: data.user_id } });
  if (!user) {
    res.clearCookie("auth").status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!data.signed_at) {
    res.clearCookie("auth").status(401).json({ error: "Unauthorized" });
    return;
  }
  const modifiedTime = new Date(user.modified).getTime();
  const signedAtTime = parseInt(data.signed_at);
  const graceModifiedTime = modifiedTime + 1000;

  if (signedAtTime < graceModifiedTime) {
    res.clearCookie("auth").status(401).json({ error: "Unauthorized" });
    return;
  }
  return user;
}

export async function verifyWSUser(socket: Socket): Promise<User | false> {
  let token = socket.handshake.auth.token;
  if (token && token.startsWith('Bearer ')) {
    token = token.substring(7);
  }
  const data = verifyJWT(token);
  if (!data) {
    return false;
  }
  let user = socket.data.app.get("userCache").get(data.user_id) as User | null;
  if (!user) {
    const prisma = socket.data.app.get("prisma") as PrismaClient;
    user = await prisma.user.findUnique({ where: { user_id: data.user_id } });
  }
  if (!user) {
    return false;
  }
  if (!data.signed_at) {
    return false;
  }

  const modifiedTime = new Date(user.modified).getTime();
  const signedAtTime = parseInt(data.signed_at);
  const graceModifiedTime = modifiedTime + 1000;

  if (signedAtTime < graceModifiedTime) {
    return false;
  }
  return user;
}
