const router = require("express").Router();
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const OUTPUT_FOLDER = path.join(__dirname, "cropped");
if (!fs.existsSync(OUTPUT_FOLDER)) {
  fs.mkdirSync(OUTPUT_FOLDER);
}
router.post("/crop-images", async (req, res) => {
  const images = req.body.images; // Expecting array of { path, x, y, width, height }

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  const results = [];

  for (let i = 0; i < images.length; i++) {
    const { path: imagePath, x, y, width, height } = images[i];

    if (!fs.existsSync(imagePath)) {
      results.push({ index: i, error: "File not found" });
      continue;
    }

    const outputFileName = `cropped_${Date.now()}_${i}.png`;
    const outputPath = path.join(OUTPUT_FOLDER, outputFileName);

    try {
      await sharp(imagePath)
        .extract({ left: x, top: y, width: width, height: height })
        .toFile(outputPath);

      results.push({ index: i, success: true, outputPath });
    } catch (error) {
      results.push({ index: i, error: error.message });
    }
  }

  res.json({ results });
});

module.exports = router;
