import { Request, Response } from "express";
import { verifyUser } from "../utils/AuthUtils";
import { PrismaClient } from "@prisma/client";
import { generateInviteCode, generateSnowflake } from "../utils/HashUtils";
import InviteCreateSchema from "../schemas/InviteCreateSchema";

export async function getChannelInvites(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const channel = await prisma.channel.findFirst({
      where: {
        channel_id: id,
        owner_id: user.user_id
      }
    });
    if (!channel) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const invites = await prisma.invite.findMany({
      where: {
        channel_id: id
      }
    });
    res.json({ invites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getInvite(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const invite = await prisma.invite.findFirst({
      where: {
        invite_id: id
      },
      include: {
        channel: {
          include: {
            owner: {
              select: {
                user_id: true,
                username: true,
                nickname: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    if (!invite) {
      res.status(404).json({ error: "Invite not found" });
      return;
    }
    res.json({ invite: invite.invite_id, channel: invite.channel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function acceptInvite(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const invite = await prisma.invite.findFirst({
      where: {
        invite_id: id
      },
      include: {
        channel: true
      }
    });
    if (!invite) {
      res.status(404).json({ error: "Invite not found" });
      return;
    }
    const existingMember = await prisma.channel.findFirst({
      where: {
        channel_id: invite.channel_id,
        members: {
          some: {
            user_id: user.user_id
          }
        }
      }
    });
    if (existingMember) {
      res.status(403).json({ error: "Already a member" });
      return;
    }
    await prisma.channel.update({
      where: {
        channel_id: invite.channel_id
      },
      data: {
        members: {
          connect: {
            user_id: user.user_id
          }
        }
      }
    });
    res.json({ channel: invite.channel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function createInvite(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { channelId } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const channel = await prisma.channel.findFirst({
      where: {
        channel_id: channelId,
        owner_id: user.user_id
      }
    });
    if (!channel) {
      res.status(403).json({ error: "Forbidden - Only channel owners can create invites" });
      return;
    }
    const invite = await prisma.invite.create({
      data: {
        invite_id: generateInviteCode(),
        channel_id: channelId,
        user_id: user.user_id
      }
    });
    res.json({ invite_code: invite.invite_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteInvite(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const invite = await prisma.invite.findFirst({
      where: {
        invite_id: id
      }
    });
    if (!invite) {
      res.status(404).json({ error: "Invite not found" });
      return;
    }
    if (invite.user_id !== user.user_id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await prisma.invite.delete({
      where: {
        invite_id: id
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}