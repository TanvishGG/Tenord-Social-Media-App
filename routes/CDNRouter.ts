import { Router } from "express";
import { getAvatar, getBanner } from "../controllers/CDNController";

const CDNRouter = Router();

CDNRouter.get("/avatar/:id", getAvatar);
CDNRouter.get("/banner/:id", getBanner);

export default CDNRouter;
