import express from "express";
import { getStorefrontImages } from "../controllers/storefront.controller.js";
const router = express.Router();

router.post("/create",getStorefrontImages);

export default router;
