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
import { sendEmailChangeEmail, sendPasswordResetEmail } from "../utils/EmailUtils";
import { filterUserData } from "../utils/DataUtils";
import { EmailUpdate, Verifications } from "../schemas/TypeInterfaces";
import ForgotPasswordSchema from "../schemas/ForgotPasswordSchema";
import EmailChangeSchema from "../schemas/EmailChangeSchema";


export async function getProfile(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    res.json({ user: filterUserData(user) });
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
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = res.app.get("prisma") as PrismaClient;
    let modified = user.modified;
    if (data.data.username) {
      data.data.username = data.data.username?.trim()?.toLowerCase();
      const usernameRegex = /^[a-z0-9_.]{3,32}$/;
      if (!usernameRegex.test(data.data.username)) {
        res.status(400).json({ 
          error: "Username must be 3-32 characters and contain only lowercase letters, numbers, underscores, and periods"
        });
        return;
      }
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: data.data.username.toLowerCase(),
        },
      });
      if (existingUsername) {
        res.status(409).json({ error: "Username already exists" });
        return;
      }
      data.data.username = data.data.username.toLowerCase();
      modified = new Date();
    }

    if (data.data.nickname) {
      const nicknameRegex = /^[a-zA-Z0-9_ ]{1,32}$/;
      if (!nicknameRegex.test(data.data.nickname)) {
        res.status(400).json({
          error: "Nickname must be 1-32 characters and can contain letters, numbers, underscores, and spaces"
        });
        return;
      }
      data.data.nickname = data.data.nickname.trim();
      modified = new Date();
    }
    if (data.data.password) {
      data.data.password = await hashPassword(data.data.password);
      modified = new Date();
    }
    if (data.data.email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: data.data.email.toLowerCase(),
        },
      });
      if (existingEmail) {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
      const code = generateVerificationToken();
      res.app.get("pendingVerifications").set(code, {
        type: "email",
        data: {
          oldEmail: user.email.toLowerCase(),
          newEmail: data.data.email.toLowerCase(),
          user_id: user.user_id
        }
      } as Verifications);
      await sendEmailChangeEmail(data.data.email.toLowerCase(), code);
      setTimeout(() => {
        res.app.get("pendingVerifications").delete(user.user_id);
      }, 60000);
    }
    if (data.data.avatar) {
      if (!/^data:image\/(png|jpeg|jpg|webp);base64/.test(data.data.avatar)) {
        res.status(400).json({ error: "Invalid avatar" });
        return;
      }
      
      const avatarSizeBytes = Buffer.byteLength(data.data.avatar.split(',')[1], 'base64');
      if (avatarSizeBytes > 10 * 1024 * 1024) { 
        res.status(400).json({ error: "Avatar file size must be less than 10MB" });
        return;
      }
      const avatar = await processProfileImage(data.data.avatar);
      const hash = generateImageHash(user.user_id);
      await prisma.avatar.create({
        data: {
          avatar_hash: hash,
          avatar: avatar as any,
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
      
      const bannerSizeBytes = Buffer.byteLength(data.data.banner.split(',')[1], 'base64');
      if (bannerSizeBytes > 10 * 1024 * 1024) { 
        res.status(400).json({ error: "Banner file size must be less than 10MB" });
        return;
      }
      const banner = await processProfileImage(data.data.banner, "banner");
      const hash = generateImageHash(user.user_id);
      await prisma.banner.create({
        data: {
          banner_hash: hash,
          banner: banner as any,
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
      user: filterUserData(updatedUser),
      message: data.data.email ? "Please verify your email" : "Profile Updated",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const data = ForgotPasswordSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const user = await prisma.user.findFirst({
      where: {
        email: data.data.email.toLowerCase(),
      },
    });
    if (!user) {
      res.status(404).json({ error: "Email not found" });
      return;
    }
    const token = generateVerificationToken();
    req.app.get("pendingVerifications").set(token, {
      type: "reset-password",
      email: user.email.toLowerCase(),
      user_id: user.user_id,
    });
    await sendPasswordResetEmail(user.email, token);
    setTimeout(() => {
      req.app.get("pendingVerifications").delete(token);
    }, 1000 * 60 * 60 * 24);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function changeEmail(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const data = EmailChangeSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    if (data.data.email.toLowerCase() === user.email) {
      res.status(400).json({ error: "Email is the same as current" });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.data.email.toLowerCase(),
      },
    });
    if (existingEmail) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const code = generateVerificationToken();
    res.app.get("pendingVerifications").set(code, {
      type: "email",
      data: {
        oldEmail: user.email.toLowerCase(),
        newEmail: data.data.email.toLowerCase(),
        user_id: user.user_id
      }
    } as Verifications);
    await sendEmailChangeEmail(data.data.email.toLowerCase(), code);
    setTimeout(() => {
      res.app.get("pendingVerifications").delete(user.user_id);
    }, 60000);
    res.status(200).json({ message: "Email change verification sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
