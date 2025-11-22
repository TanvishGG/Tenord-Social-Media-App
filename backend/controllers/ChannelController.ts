import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { verifyUser } from "../utils/AuthUtils";
import { Socket } from "socket.io";
import createChannelSchema from "../schemas/CreateChannelSchema";
import { generateSnowflake } from "../utils/HashUtils";
import MessageSchema from "../schemas/MessageSchema";

export async function GetAllChannels(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const prisma = res.app.get("prisma") as PrismaClient;
  try {
    const channels = await prisma.channel.findMany({
      include: {
        owner: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
        members: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
      },
      where: {
        members: {
          some: {
            user_id: user.user_id,
          },
        },
      },
    });
    res.status(200).json(channels);
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllChannelsAndDms(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const prisma = res.app.get("prisma") as PrismaClient;
  try {
    const channels = await prisma.channel.findMany({
      include: {
        owner: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
        members: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
      },
      where: {
        members: {
          some: {
            user_id: user.user_id,
          },
        },
      },
    });
    const dms = await prisma.dmChannel.findMany({
      where: {
        OR: [
          { user1_id: user.user_id },
          { user2_id: user.user_id },
        ],
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
          },
        },
        user2: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
      },
    });
    res.status(200).json({ channels, dms, user });
  } catch (error) {
    console.error("Error fetching channels and dms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getChannelById(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const channel = req.params.channelId;
  const prisma = res.app.get("prisma") as PrismaClient;
  try {
    const channelData = await prisma.channel.findUnique({
      where: {
        channel_id: channel,
      },
      include: {
        owner: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
        members: {
          select: {
            user_id: true,
            username: true,
            nickname: true,
            avatar: true,
            banner: true,
            about: true,
          },
        },
        messages: {
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
      },
    });
    if (!channelData) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }

    
    const getOnlineMembers = req.app.get("getOnlineMembers") as Function;
    const onlineMembers = await getOnlineMembers(channel, false);

    res.status(200).json({ ...channelData, onlineMembers });
  } catch (error) {
    console.error("Error fetching channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createChannel(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const prisma = res.app.get("prisma") as PrismaClient;
  try {
    const data = createChannelSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map(issue => issue.message).join(', ') });
      return;
    }

    const newChannel = await prisma.channel.create({
      data: {
        name: data.data.name,
        owner_id: user.user_id,
        channel_id: generateSnowflake(),
        members: {
          connect: {
            user_id: user.user_id,
          },
        },
      },
    });
    res.status(200).json(newChannel);
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function editChannel(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const channelId = req.params.channelId;
  const prisma = res.app.get("prisma") as PrismaClient;
  try {
    const channel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
    });
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    if (channel.owner_id !== user.user_id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const data = createChannelSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map(issue => issue.message).join(', ') });
      return;
    }

    const updatedChannel = await prisma.channel.update({
      where: { channel_id: channelId },
      data: {
        name: data.data.name,
      },
    });
    res.status(200).json(updatedChannel);
  } catch (error) {
    console.error("Error updating channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteChannel(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
  const channelId = req.params.channelId;
  const prisma = res.app.get("prisma") as PrismaClient;

  try {
    const channel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
    });
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    if (channel.owner_id !== user.user_id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.channel.delete({
      where: { channel_id: channelId },
    });
    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateChannel(req: Request, res: Response) {
  const user = await verifyUser(req, res);
  if (!user) return;
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { channelId } = req.params;
    const data = MessageSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const channel = await prisma.channel.findFirst({
      where: {
        channel_id: channelId,
        members: {
          some: {
            user_id: user.user_id,
          },
        },
      },
    });
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    const message = await prisma.message.create({
      data: {
        message_id: generateSnowflake(),
        channel_id: channelId,
        author: user.user_id,
        content: data.data.content,
        timestamp: Date.now().toString(),
      },
    });
    const io = req.app.get("ws") as any;
    io.to(channelId).emit("message", {
      message_id: message.message_id,
      content: message.content,
      username: user.username,
      author: user.user_id,
      channel: channelId,
      nickname: user.nickname,
      avatar: user.avatar,
      banner: user.banner,
      about: user.about,
      timestamp: message.timestamp,
    });
    res.json({ success: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function editMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { channelId, messageId } = req.params;
    const data = MessageSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error.issues.map((issue: any) => issue.message).join(', ') });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const updated = await prisma.message.updateMany({
      where: {
        message_id: messageId,
        author: user.user_id,
        channel_id: channelId,
      },
      data: {
        content: data.data.content,
      },
    });
    if (updated.count === 0) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const io = req.app.get("ws") as any;
    io.to(channelId).emit("messageEdit", {
      message_id: messageId,
      content: data.data.content,
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const user = await verifyUser(req, res);
    if (!user) return;
    const { channelId, messageId } = req.params;
    const prisma = req.app.get("prisma") as PrismaClient;
    const deleted = await prisma.message.deleteMany({
      where: {
        message_id: messageId,
        author: user.user_id,
        channel_id: channelId,
      },
    });
    if (deleted.count === 0) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const io = req.app.get("ws") as any;
    io.to(channelId).emit("messageDelete", {
      message_id: messageId,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
