const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");
const processBubbles = require("./Helper/processedFn");

const router = require("./Routes/route.js"); // Import your routes

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(router);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint to send image to Python server
app.post(
  "/process-omr",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "data", maxCount: 1 }, // optional if sending as JSON string
  ]),
  async (req, res) => {
    console.log("called");
    const imagePath = path.join(
      __dirname,
      "uploads",
      req.files["image"][0].filename
    );
    const dataFile = req.files["data"]?.[0];
    const pythonServerUrl = "http://127.0.0.1:5001/process-omr";
    const fileName = req.files["image"][0].filename;

    const jsonPath = path.join(__dirname, "uploads", dataFile.filename);

    // ✅ Read and parse JSON file
    const jsonString = fs.readFileSync(jsonPath, "utf-8");
    const jsonData = JSON.parse(jsonString);

    try {
      // Send image to Python server
      const obj = {
        ...jsonData,
        file_name: fileName,
      };

      const response = await axios.post(pythonServerUrl, obj, {
        headers: { "Content-Type": "application/json" },
      });

      // Example grid configuration
      if (response.data) {
        const { width, height, x, y } = jsonData;

        const gridConfig = {
          ...jsonData,
          imageHeight: height,
          imageWidth: width,
          offsetX: x,
          offsetY: y,
        };
        const str = processBubbles(gridConfig, response.data.bubbles);
        return res.json({ result: str, reading_data: response.data });
      }
      fs.unlinkSync(imagePath); // Delete image after processing
      res.json(response.data);
    } catch (error) {
      console.error("Python processing failed:", error);
      res.status(500).json({ error: "Processing failed" });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`Node.js server running on http://localhost:${port}`);
});
