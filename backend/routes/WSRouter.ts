import { Server, Socket } from "socket.io";
import { verifyWSUser } from "../utils/AuthUtils";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";

export default function WSRouter(io: Server, app: Application) {
  const prisma = app.get("prisma") as PrismaClient;

  
  const onlineUsers = new Map<string, { socketId: string; user: any }>();

  io.use(async (socket, next) => {
    socket.data.app = app;
    const user = await verifyWSUser(socket);
    if (!user) {
      socket.emit("error", { message: "Unauthorized" });
      socket.disconnect(true);
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.user = user;
    next();
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user;
    console.log(`[WS] User ${user.username} (${user.user_id}) connected with socket ID ${socket.id}`);

    
    onlineUsers.set(user.user_id, { socketId: socket.id, user });

    
    try {
      
      const channels = await prisma.channel.findMany({
        where: {
          members: {
            some: {
              user_id: user.user_id,
            },
          },
        },
        select: {
          channel_id: true,
        },
      });

      
      const dms = await prisma.dmChannel.findMany({
        where: {
          OR: [
            { user1_id: user.user_id },
            { user2_id: user.user_id },
          ],
        },
        select: {
          channel_id: true,
        },
      });

      
      const allRooms = [...channels.map(c => c.channel_id), ...dms.map(d => d.channel_id)];
      socket.join(allRooms);

      console.log(`[WS] User ${user.username} joined rooms:`, allRooms);

      
      for (const roomId of allRooms) {
        socket.to(roomId).emit("userOnline", {
          user_id: user.user_id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
        });
      }

    } catch (error) {
      console.error("[WS] Error joining rooms:", error);
    }

    
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`[WS] User ${user.username} joined room: ${roomId}`);

      
      socket.to(roomId).emit("userOnline", {
        user_id: user.user_id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      });
    });

    
    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(roomId);
      console.log(`[WS] User ${user.username} left room: ${roomId}`);

      
      socket.to(roomId).emit("userOffline", {
        user_id: user.user_id,
      });
    });

    
    socket.on("typing", (data: { channelId: string; isTyping: boolean }) => {
      socket.to(data.channelId).emit("userTyping", {
        user_id: user.user_id,
        username: user.username,
        isTyping: data.isTyping,
      });
    });

    socket.on("disconnect", async () => {
      console.log(`[WS] User ${user.username} (${user.user_id}) disconnected`);

      
      onlineUsers.delete(user.user_id);

      try {
        
        const [channels, dms] = await Promise.all([
          prisma.channel.findMany({
            where: {
              members: {
                some: {
                  user_id: user.user_id,
                },
              },
            },
            select: {
              channel_id: true,
            },
          }),
          prisma.dmChannel.findMany({
            where: {
              OR: [
                { user1_id: user.user_id },
                { user2_id: user.user_id },
              ],
            },
            select: {
              channel_id: true,
            },
          }),
        ]);

        const allRooms = [...channels.map(c => c.channel_id), ...dms.map(d => d.channel_id)];

        
        for (const roomId of allRooms) {
          socket.to(roomId).emit("userOffline", {
            user_id: user.user_id,
          });
        }

      } catch (error) {
        console.error("[WS] Error handling disconnect:", error);
      }
    });
  });

  
  async function getOnlineMembers(channelId: string, isDM: boolean = false) {
    try {
      let members: any[] = [];

      if (isDM) {
        const dm = await prisma.dmChannel.findUnique({
          where: { channel_id: channelId },
          include: {
            user1: {
              select: {
                user_id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
            user2: {
              select: {
                user_id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        });

        if (dm) {
          members = [dm.user1, dm.user2];
        }
      } else {
        const channel = await prisma.channel.findUnique({
          where: { channel_id: channelId },
          include: {
            members: {
              select: {
                user_id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        });

        if (channel) {
          members = channel.members;
        }
      }

      
      const onlineMembers = members.filter(member => onlineUsers.has(member.user_id));

      return onlineMembers;
    } catch (error) {
      console.error("[WS] Error getting online members:", error);
      return [];
    }
  }

  
  app.set("getOnlineMembers", getOnlineMembers);
  app.set("onlineUsers", onlineUsers);
}
