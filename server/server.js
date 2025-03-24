const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const processBubbles = require("./Helper/processedFn");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint to send image to Python server
app.post("/process-omr", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, "uploads", req.file.filename);
  const pythonServerUrl = "http://127.0.0.1:5001/process-omr";
  const fileName = req.file.filename;
  try {
    // Send image to Python server
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(
      pythonServerUrl,
      { fileName: fileName },
      { headers: { "Content-Type": "application/json" } }
    );
    // Example grid configuration
    const gridConfig = {
      Total_Row: 5,
      Total_Col: 4,
      row_Height: 34, // Adjust based on actual grid spacing
      col_Width: 50, // Adjust based on actual column width
      fieldType: "alpha",
      readingDirection: "top to bottom",
    };
    if (response.data) {
      const str = processBubbles(gridConfig, response.data.bubbles);
      return res.json({ result: str , reading_data : response.data});
    }
    fs.unlinkSync(imagePath); // Delete image after processing
    res.json(response.data);
  } catch (error) {
    console.error("Python processing failed:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Node.js server running on http://localhost:${port}`);
});
