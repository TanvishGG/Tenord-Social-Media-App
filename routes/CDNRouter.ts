import { Router } from "express";
import { getAvatar, getBanner } from "../controllers/CDNController";

const CDNRouter = Router();

CDNRouter.get("/avatar/:id", getAvatar);
CDNRouter.get("/banner/:id", getBanner);
CDNRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
export default CDNRouter;
