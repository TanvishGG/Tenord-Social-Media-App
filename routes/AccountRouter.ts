import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/AccountController";
const AccountRouter = Router();

AccountRouter.get("/", getProfile);
AccountRouter.patch("/edit", updateProfile);

AccountRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
export default AccountRouter;
