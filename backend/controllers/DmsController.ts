import { Request, Response } from "express";
import { verifyUser } from "../utils/AuthUtils";
import { PrismaClient } from "@prisma/client";
import { generateSnowflake } from "../utils/HashUtils";
import DmCreateSchema from "../schemas/DmCreateSchema";
import MessageSchema from "../schemas/MessageSchema";

export async function getUserDms(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const prisma = req.app.get("prisma") as PrismaClient;
    const dms = await prisma.dmChannel.findMany({
      where: {
        OR: [
          { user1_id: user.user_id },
          { user2_id: user.user_id }
        ]
      },
      include: {
        user1: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          }
        },
        user2: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          }
        }
      }
    });
    res.json({ dms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function createDm(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const data = DmCreateSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    if (user.username === data.data.username.toLowerCase()) {
      res.status(403).json({ error: "Cannot DM yourself" });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const otherUser = await prisma.user.findFirst({
      where: {
        username: data.data.username.toLowerCase()
      }
    });
    if (!otherUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    let dm = await prisma.dmChannel.findFirst({
      where: {
        OR: [
          { user1_id: user.user_id, user2_id: otherUser.user_id },
          { user1_id: otherUser.user_id, user2_id: user.user_id }
        ]
      }
    });
    if (!dm) {
      dm = await prisma.dmChannel.create({
        data: {
          channel_id: generateSnowflake(),
          user1_id: user.user_id,
          user2_id: otherUser.user_id
        }
      });
    }
    res.json({ dm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getDm(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const dm = await prisma.dmChannel.findFirst({
      where: {
        channel_id: id,
        OR: [
          { user1_id: user.user_id },
          { user2_id: user.user_id }
        ]
      },
      include: {
        user1: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          }
        },
        user2: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          }
        },
        dmMessages: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                nickname: true,
                avatar: true,
                banner: true,
                about: true,
              }
            }
          },
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });
    if (!dm) {
      res.status(404).json({ error: "DM not found" });
      return;
    }

    
    const getOnlineMembers = req.app.get("getOnlineMembers") as Function;
    const onlineMembers = await getOnlineMembers(id, true);

    const other = dm.user1_id === user.user_id ? dm.user2 : dm.user1;
    res.json({ dm, other, onlineMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function sendDmMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id } = req.params;
    const data = MessageSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const dm = await prisma.dmChannel.findFirst({
      where: {
        channel_id: id,
        OR: [
          { user1_id: user.user_id },
          { user2_id: user.user_id }
        ]
      }
    });
    if (!dm) {
      res.status(404).json({ error: "DM not found" });
      return;
    }
    const message = await prisma.dmMessage.create({
      data: {
        message_id: generateSnowflake(),
        channel_id: id,
        author: user.user_id,
        content: data.data.content,
        timestamp: Date.now().toString()
      }
    });
    const io = req.app.get("ws") as any;
    io.to(id).emit('message', {
      message_id: message.message_id,
      content: message.content,
      username: user.username,
      author: user.user_id,
      channel: id,
      nickname: user.nickname,
      avatar: user.avatar,
      banner: user.banner,
      about: user.about,
      timestamp: message.timestamp
    });
    res.json({ success: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function editDmMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id, mid } = req.params;
    const data = MessageSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const updated = await prisma.dmMessage.updateMany({
      where: {
        message_id: mid,
        author: user.user_id,
        channel_id: id
      },
      data: {
        content: data.data.content
      }
    });
    if (updated.count === 0) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const io = req.app.get("ws") as any;
    io.to(id).emit('messageEdit', {
      message_id: mid,
      content: data.data.content
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteDmMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { id, mid } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const deleted = await prisma.dmMessage.deleteMany({
      where: {
        message_id: mid,
        author: user.user_id,
        channel_id: id
      }
    });
    if (deleted.count === 0) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const io = req.app.get("ws") as any;
    io.to(id).emit('messageDelete', {
      message_id: mid
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}