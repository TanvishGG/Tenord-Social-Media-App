import { Router } from "express";
import {
  LoginController,
  RegisterController,
  VerifyController,
  ForgotPasswordController,
} from "../controllers/AuthenticationController";
const AuthenticationRouter = Router();

AuthenticationRouter.post("/login", LoginController);

AuthenticationRouter.post("/register", RegisterController);

AuthenticationRouter.get("/verify/:token", VerifyController);

AuthenticationRouter.post("/forgot-password", ForgotPasswordController);

AuthenticationRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default AuthenticationRouter;
