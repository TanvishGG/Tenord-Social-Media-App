import { Router } from "express";
import {
  LoginController,
  RegisterController,
  VerifyController,
} from "../controllers/AuthenticationController";
const AuthenticationRouter = Router();

AuthenticationRouter.post("/login", LoginController);

AuthenticationRouter.post("/register", RegisterController);

AuthenticationRouter.get("/verify/:token", VerifyController);

export default AuthenticationRouter;
