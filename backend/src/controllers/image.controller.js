import fs, { truncate } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const imageDir = path.join(__dirname, "..", "..", "..", "images");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// save image is to rename image to saved-image.png in and move it to saved folder
// remove image is to rename image to removed-image.png in and it move to removed folder
// delete image is to delete the image entirely

export async function getAllImages(req, res) {
  try {
    const { includeMain, onlySubfolders, excludeSubfolders } = req.query;
    console.log(req.query);
    const includeMainBool = includeMain === "true";
    const onlySubs = onlySubfolders ? onlySubfolders.split(",") : [];
    const excludeSubs = excludeSubfolders ? excludeSubfolders.split(",") : [];

    const images = await getImagesFlexible(imageDir, {
      includeMain: true,
      onlySubfolders: onlySubs,
      excludeSubfolders: excludeSubs,
    });
    if (images.length === 0) {
      return res.status(404).send("No images found");
    }
    const searchTerm = req.query.search;
    const filteredImages = filterImagesByKeyword(images, searchTerm);

    const mapped = getImagesData(req, filteredImages);

    return res.send(mapped);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
export async function getImage(req, res) {
  const imageName = req.params.id;
  try {
    const theImage = await imageSearch(imageName);
    if (!theImage) {
      return res.status(404).send("Image not found");
    }
    res.status(200).send(theImage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
export async function renameImage(req, res) {
  try {
    if (!req.body) {
      return res.status(400).send("New image name is required");
    }
    const oldName = req.params.id;
    const newName = req.body.newImageName;

    const oldDir = path.join(imageDir);
    const resultPath = await renameAndMoveFile(
      oldName,
      newName,
      oldDir,
      oldDir
    );

    // const theImage = await imageSearch(imageName);
    // if (!theImage) {
    //   return res.status(404).send("Image not found");
    // }
    // const oldPath = path.join(imageDir, imageName + theImage.extention);
    // const newPath = path.join(imageDir, newImageName + theImage.extention);
    // if (fs.existsSync(newPath)) {
    //   return res.status(400).send("Image with this name already exists");
    // }
    // await fs.promises.rename(oldPath, newPath);
    return res.status(200).json({
      message: "Image renamed successfully",
      success: true,
      resultPath,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
export async function deleteImage(req, res) {
  const imageName = req.params.id;
  try {
    if (await imageSearch(imageName)) {
      const theImage = await imageSearch(imageName);
      const oldPath = path.join(imageDir, imageName + theImage.extention);
      await fs.promises.unlink(oldPath);
      return res.status(200).send("Image deleted successfully");
    } else {
      return res.status(404).send("Image not found");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function saveImage(req, res) {
  try {
    const oldName = req.params.id;
    const newName = "saved-" + oldName;

    const oldDir = path.join(imageDir);
    const newDir = path.join(imageDir, "saved");

    const resultPath = await renameAndMoveFile(
      oldName,
      newName,
      oldDir,
      newDir
    );
    return res
      .status(200)
      .json({ message: "Image saved successfully", success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
}
export async function removeImage(req, res) {
  try {
    const oldName = req.params.id;
    const newName = "removed-" + oldName;

    const oldDir = path.join(imageDir);
    const newDir = path.join(imageDir, "removed");

    const resultPath = await renameAndMoveFile(
      oldName,
      newName,
      oldDir,
      newDir
    );
    return res
      .status(200)
      .json({ message: "Image removed successfully", success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
}

export async function getImagesFromFolder(req, res) {
  try {
    const { folderName } = req.params;

    // Only allow specific folder names (optional security step)
    const allowedFolders = ["saved", "archived", "incoming"];
    if (!allowedFolders.includes(folderName)) {
      return res.status(400).send({ error: "Invalid folder name" });
    }

    const folderPath = path.join(imageDir, folderName);
    const files = await fs.promises.readdir(folderPath);

    // Optional: filter image files
    const imageFiles = files.filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(
        path.extname(file).toLowerCase()
      )
    );

    res.status(200).send({ images: imageFiles });
  } catch (error) {
    res.status(500).send({ error: "Failed to read folder" });
  }
}

async function imageSearch(imageName) {
  async function searchDir(dir) {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        const result = await searchDir(fullPath);
        if (result) return result;
      } else {
        for (const ext of allowedExtensions) {
          if (item.name === imageName + ext) {
            return {
              exist: "true",
              extention: ext,
              path: fullPath,
            };
          }
        }
      }
    }

    return null;
  }

  return await searchDir(imageDir);
}

export async function getImagesFlexible(
  baseDir,
  { includeMain = true, onlySubfolders = [], excludeSubfolders = [] } = {}
) {
  const images = [];

  try {
    // Read all entries in baseDir
    const entries = await fs.promises.readdir(baseDir, { withFileTypes: true });

    // Helper function to collect images in a folder (non-recursive)
    async function getImagesInFolder(folder) {
      const files = await fs.promises.readdir(folder, { withFileTypes: true });
      return files
        .filter(
          (file) =>
            file.isFile() &&
            allowedExtensions.includes(path.extname(file.name).toLowerCase())
        )
        .map((file) => path.join(folder, file.name));
    }

    // 1. Include main folder images if asked
    if (includeMain) {
      const mainImages = await getImagesInFolder(baseDir);
      images.push(...mainImages);
    }

    // 2. Process subfolders
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderName = entry.name;

        // Skip based on onlySubfolders and excludeSubfolders rules
        if (onlySubfolders.length > 0 && !onlySubfolders.includes(folderName)) {
          continue;
        }
        if (excludeSubfolders.includes(folderName)) {
          continue;
        }

        // Get images in this subfolder (non-recursive)
        const subfolderPath = path.join(baseDir, folderName);
        const subfolderImages = await getImagesInFolder(subfolderPath);
        images.push(...subfolderImages);
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }

  return images;
}

async function renameAndMoveFile(oldName, newName, oldDir, newDir) {
  const theImage = await imageSearch(oldName);
  if (!theImage) {
    throw new Error("Image not found");
  }

  const extension = theImage.extention;

  const oldPath = theImage.path;
  const newPath = path.join(newDir, newName + extension);

  if (fs.existsSync(newPath)) {
    throw new Error("Image with this name already exists in the destination");
  }

  await fs.promises.mkdir(newDir, { recursive: true });
  await fs.promises.rename(oldPath, newPath);

  return newPath;
}

export function filterImagesByKeyword(images, keyword) {
  if (!keyword) return images;
  const keywords = keyword.trim().toLowerCase().split(/\s+/);
  return images.filter((imgPath) => {
    const fileName = path.basename(imgPath).toLowerCase();
    return keywords.every((keyword) => fileName.includes(keyword));
  });
}

export function getImagesData(req, images) {
  const baseUrl = `${req.protocol}://${req.hostname}:3000`;

  return images.map((fullPath) => {
    const relPath = path.relative(imageDir, fullPath);
    const fileName = path.basename(relPath);

    return {
      itemSrc: `${baseUrl}/api/images/${relPath.replace(/\\/g, "/")}`,
      itemName: fileName,
    };
  });
}
