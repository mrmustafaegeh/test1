import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { login, logout, getUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout",protectRoute, logout);
router.get("/getuser",protectRoute, getUser);

export default router;
