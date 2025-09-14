import {
  getImagesFlexible,
  filterImagesByKeyword,
  getImagesData
} from "./image.controller.js";
import { imageDir } from "./image.controller.js";
import { generateImage } from "../services/ai.service.js";
export async function getStorefrontImages(req, res) {
  try {
    if (
      !req.body?.imageName ||
      !req.body?.amount ||
      !req.body?.needsGeneration
    ) {
      return res
        .status(400)
        .send(
          "Image name(string), amount(int) and needsGeneration(boolean) are required"
        );
    }
    const imageName = req.body.imageName;
    const amount = req.body.amount;
    const needsGeneration = req.body.needsGeneration === "true";
    const minAmount = 1;
    const maxAmount = 10;
    const clampedAmount = Math.min(Math.max(amount, minAmount), maxAmount);
    const existingImages = await getImagesFlexible(imageDir, {
      includeMain: false,
      onlySubfolders: [],
      excludeSubfolders: "removed",
    });
    const matchingImages = filterImagesByKeyword(existingImages, imageName);

    if (!needsGeneration || existingImages.length >= clampedAmount) {
      const mapped = getImagesData(req, matchingImages);
      return res.status(200).send(mapped);
    } else {
      const missingAmount = clampedAmount - existingImages.length;
      const generatedImages = await generateImage(imageName, missingAmount);
      const allImages = [...matchingImages, ...generatedImages];
      const mapped = getImagesData(req, allImages);
      return res.status(200).send(mapped);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
