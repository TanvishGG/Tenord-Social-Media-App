import { Request, Response } from "express";
import LoginSchema from "../schemas/LoginSchema";
import {
  comparePassword,
  generateRandomPassword,
  generateSnowflake,
  generateVerificationToken,
  hashPassword,
  signJWT,
} from "../utils/HashUtils";
import RegisterSchema from "../schemas/RegisterSchema";
import { PrismaClient } from "@prisma/client";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/EmailUtils";
import ForgotPasswordSchema from "../schemas/ForgotPasswordSchema";
export async function LoginController(req: Request, res: Response) {
  try {
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = (await req.app.get("prisma")) as PrismaClient;
    const user = await prisma.user.findFirst({
      where: {
        email: data.data.email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Email not found" });
      return;
    }
    if (!(await comparePassword(data.data.password, user.password))) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    const token = signJWT({
      user_id: user.user_id,
      signed_at: Date.now().toString(),
    });
    res.status(200).cookie("auth", token).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function RegisterController(req: Request, res: Response) {
  try {
    const data = RegisterSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.data.email,
      },
    });
    if (existingEmail) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: data.data.username,
      },
    });
    if (existingUsername) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }
    const token = generateVerificationToken();
    req.app.get("pendingRegistrations").set(token, data.data);
    setTimeout(
      () => req.app.get("pendingRegistrations").delete(data.data.email),
      1000 * 60 * 60 * 24,
    );
    await sendVerificationEmail(data.data.email, token);
    res.status(201).json({ message: "Verification Email Sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function VerifyController(req: Request, res: Response) {
  try {
    const token = req.params.token as string;
    const tokenData = req.app.get("pendingVerifications").get(token);
    if (!tokenData) {
      res.status(404).json({ error: "Token not found" });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    if (tokenData.type === "register") {
      await prisma.user.create({
        data: {
          ...tokenData.user,
          user_id: generateSnowflake(),
          nickname: tokenData.user.username,
        },
      });
      req.app.get("pendingVerifications").delete(token);
      res.status(201).redirect("/login?verified=true");
    } else if (tokenData.type === "email") {
      await prisma.user.update({
        where: {
          email: tokenData.oldEmail,
        },
        data: {
          email: tokenData.newEmail,
          modified: Date.now().toString(),
        },
      });
      req.app.get("pendingVerifications").delete(token);
      req.app.get("userCache").delete(tokenData.user_id);
      res.status(200).redirect("/account");
    } else if (tokenData.type === "reset-password") {
      const newPassword = generateRandomPassword();
      const passwordHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: {
          email: tokenData.email,
        },
        data: {
          password: passwordHash,
          modified: Date.now().toString(),
        },
      });
      req.app.get("pendingVerifications").delete(token);
      req.app.get("userCache").delete(tokenData.user_id);
      res.redirect(`/login?newPassword=${newPassword}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function ForgotPasswordController(req: Request, res: Response) {
  try {
    const data = ForgotPasswordSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const user = await prisma.user.findFirst({
      where: {
        email: data.data.email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Email not found" });
      return;
    }
    const token = generateVerificationToken();
    req.app.get("pendingVerifications").set(token, {
      type: "reset-password",
      email: user.email,
      user_id: user.user_id,
    });
    await sendPasswordResetEmail(user.email, token);
    setTimeout(
      () => {
        req.app.get("pendingVerifications").delete(token);
      },
      1000 * 60 * 60 * 24,
    );
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
