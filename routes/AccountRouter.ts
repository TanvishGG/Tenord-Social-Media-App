import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/AccountController";
const AccountRouter = Router();

AccountRouter.get("/", getProfile);
AccountRouter.patch("/edit", updateProfile);

export default AccountRouter;
