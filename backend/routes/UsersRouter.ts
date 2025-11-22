import { Router } from "express";
import { getUserProfile } from "../controllers/UsersController";

const UsersRouter = Router();

UsersRouter.get("/:id", getUserProfile);

UsersRouter.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default UsersRouter;