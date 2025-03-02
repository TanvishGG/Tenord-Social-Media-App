import { Request, Response } from "express";
import { verifyUser } from "../utils/AuthUtils";
import ProfileUpdateSchema from "../schemas/ProfileUpdateSchema";
import {
  generateImageHash,
  generateVerificationToken,
  hashPassword,
} from "../utils/HashUtils";
import { processProfileImage } from "../utils/ImageUtils";
import { PrismaClient } from "@prisma/client";
import { sendEmailChangeEmail } from "../utils/EmailUtils";

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    res.json({ user: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const data = ProfileUpdateSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = res.app.get("prisma") as PrismaClient;
    let modified = user.modified;
    if (data.data.password) {
      data.data.password = await hashPassword(data.data.password);
      modified = Date.now().toString();
    }
    if (data.data.email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: data.data.email,
        },
      });
      if (existingEmail) {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
      const code = generateVerificationToken();
      res.app.get("pendingVerifications").set(code, {
        type: "email",
        oldEmail: user.email,
        newEmail: data.data.email,
        user_id: user.user_id,
      });
      await sendEmailChangeEmail(data.data.email, code);
      setTimeout(() => {
        res.app.get("pendingVerifications").delete(user.user_id);
      }, 60000);
    }
    if (data.data.avatar) {
      if (!/^data:image\/(png|jpeg|jpg|webp);base64/.test(data.data.avatar)) {
        res.status(400).json({ error: "Invalid avatar" });
        return;
      }
      const avatar = await processProfileImage(data.data.avatar);
      const hash = generateImageHash(user.user_id);
      await prisma.avatar.create({
        data: {
          avatar_hash: hash,
          avatar: avatar,
        },
      });
      data.data.avatar = hash + ".webp";
      prisma.avatar
        .delete({
          where: {
            avatar_hash: user.avatar?.split(".")[0],
          },
        })
        .catch(() => {});
    }
    if (data.data.banner) {
      if (!/^data:image\/(png|jpeg|jpg|webp);base64/.test(data.data.banner)) {
        res.status(400).json({ error: "Invalid banner" });
        return;
      }
      const banner = await processProfileImage(data.data.banner, "banner");
      const hash = generateImageHash(user.user_id);
      await prisma.banner.create({
        data: {
          banner_hash: hash,
          banner: banner,
        },
      });
      data.data.banner = hash + ".webp";
      prisma.banner
        .delete({
          where: {
            banner_hash: user.banner?.split(".")[0],
          },
        })
        .catch(() => {});
    }
    const updatedUser = await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        password: data.data.password ?? user.password,
        username: data.data.username ?? user.username,
        nickname: data.data.nickname ?? user.nickname,
        avatar: data.data.avatar ?? user.avatar,
        about: data.data.about ?? user.about,
        banner: data.data.banner ?? user.banner,
        modified: modified,
      },
    });
    req.app.get("userCache").set(updatedUser.user_id, updatedUser);
    res.json({
      success: true,
      user: updatedUser,
      message: data.data.email ? "Please verify your email" : "Profile Updated",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
