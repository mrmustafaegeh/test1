import express from "express";
import { getAllImages, getImage,renameImage,saveImage, deleteImage, removeImage } from "../controllers/image.controller.js";
const router = express.Router();

router.get("/", getAllImages);
router.get("/:id", getImage);
router.patch("/:id", renameImage);
router.post("/:id/save", saveImage);
router.post("/:id/remove", removeImage);
router.delete("/:id", deleteImage);

export default router;