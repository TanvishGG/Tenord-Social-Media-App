import { Router } from "express";
import { getUserDms, createDm, getDm, sendDmMessage, editDmMessage, deleteDmMessage } from "../controllers/DmsController";

const DmsRouter = Router();

DmsRouter.get("/", getUserDms);
DmsRouter.post("/create", createDm);
DmsRouter.get("/:id", getDm);
DmsRouter.post("/:id/messages", sendDmMessage);
DmsRouter.patch("/:id/messages/:mid", editDmMessage);
DmsRouter.delete("/:id/messages/:mid", deleteDmMessage);

DmsRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default DmsRouter;