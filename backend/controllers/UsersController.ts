import { Request, Response } from "express";
import { verifyUser } from "../utils/AuthUtils";
import { PrismaClient } from "@prisma/client";
import { filterUserData } from "../utils/DataUtils";

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { user_id: id },
          { username: id.toLowerCase() }
        ]
      }
    });
    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      username: targetUser.username,
      nickname: targetUser.nickname,
      user_id: targetUser.user_id,
      banner: targetUser.banner,
      avatar: targetUser.avatar,
      about: targetUser.about,
      created_at: targetUser.user_id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}