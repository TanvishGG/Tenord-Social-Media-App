import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export async function getAvatar(req: Request, res: Response) {
  const id = req.params.id.split(".")[0];
  const prisma = res.app.get("prisma") as PrismaClient;
  const avatar = await prisma.avatar.findFirst({
    where: {
      avatar_hash: id,
    },
  });
  if (!avatar) {
    res.status(404).json({ error: "Avatar not found" });
    return;
  }
  res.setHeader("Content-Type", "image/webp");
  res.setHeader("Cache-Control", "public, max-age=999999999");
  res.status(200).send(Buffer.from(avatar.avatar));
}
export async function getBanner(req: Request, res: Response) {
  const id = req.params.id.split(".")[0];
  const prisma = res.app.get("prisma") as PrismaClient;
  const banner = await prisma.banner.findFirst({
    where: {
      banner_hash: id,
    },
  });
  if (!banner) {
    res.status(404).json({ error: "Banner not found" });
    return;
  }
  res.setHeader("Content-Type", "image/webp");
  res.setHeader("Cache-Control", "public, max-age=999999999");
  res.status(200).send(Buffer.from(banner.banner));
}
