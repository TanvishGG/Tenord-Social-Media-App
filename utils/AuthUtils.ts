import { PrismaClient, User } from "@prisma/client";
import { Response, Request } from "express";
import { verifyJWT } from "./HashUtils";

export async function verifyUser(
  req: Request,
  res: Response,
): Promise<User | void> {
  const data = verifyJWT(
    req.cookies?.auth ?? req.headers.authorization?.trim(),
  );
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
  if (!data.signed_at || user.modified >= data.signed_at) {
    res.clearCookie("auth").status(401).json({ error: "Unauthorized" });
    return;
  }
  return user;
}
