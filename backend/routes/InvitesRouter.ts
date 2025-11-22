import { Router } from "express";
import { getChannelInvites, getInvite, acceptInvite, createInvite, deleteInvite } from "../controllers/InvitesController";

const InvitesRouter = Router();

InvitesRouter.get("/channel/:id", getChannelInvites);
InvitesRouter.get("/:id", getInvite);
InvitesRouter.post("/:id/accept", acceptInvite);
InvitesRouter.post("/channels/:channelId/invites", createInvite);
InvitesRouter.delete("/:id", deleteInvite);

InvitesRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default InvitesRouter;