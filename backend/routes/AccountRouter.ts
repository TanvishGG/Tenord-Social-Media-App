import { Router } from "express";
import { getProfile, updateProfile, resetPassword, changeEmail } from "../controllers/AccountController";
const AccountRouter = Router();

AccountRouter.get("/", getProfile);
AccountRouter.patch("/edit", updateProfile);
AccountRouter.post("/reset-password", resetPassword);
AccountRouter.patch("/email-change", changeEmail);

AccountRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
export default AccountRouter;
