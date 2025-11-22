import { Router } from "express";
import { 
    createChannel, 
    deleteChannel, 
    editChannel, 
    GetAllChannels, 
    getChannelById, 
    sendMessage, 
    editMessage, 
    deleteMessage, 
    getAllChannelsAndDms 
} from "../controllers/ChannelController";

const ChannelRouter = Router();

ChannelRouter.get("/", GetAllChannels);
ChannelRouter.get("/all", getAllChannelsAndDms);
ChannelRouter.get("/:channelId", getChannelById);
ChannelRouter.post("/create", createChannel);
ChannelRouter.patch("/:channelId", editChannel);
ChannelRouter.delete("/:channelId", deleteChannel);
ChannelRouter.post("/:channelId/messages", sendMessage);
ChannelRouter.patch("/:channelId/messages/:messageId", editMessage);
ChannelRouter.delete("/:channelId/messages/:messageId", deleteMessage);

export default ChannelRouter;