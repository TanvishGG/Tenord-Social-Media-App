import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export async function getProfile(req: Request, res: Response) {
  const data = req.cookies.auth ?? req.headers.authorization;
  return res.json({ user: data });
}
