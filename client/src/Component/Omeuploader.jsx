import React, { useEffect, useRef, useState } from "react";

const OmrProcessor = () => {
  const [cvReady, setCvReady] = useState(false);
  const [outputText, setOutputText] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    window.cvReady = () => {
      setCvReady(true);
      console.log("OpenCV.js Loaded!");
    };
  }, []);

  const handleImageUpload = (event) => {
    if (!cvReady) {
      console.error("OpenCV.js is not yet ready");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => processImage(img);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (img) => {
    if (!window.cv) {
      console.error("OpenCV.js is not loaded");
      return;
    }

    const cv = window.cv;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let src = cv.imread(canvas);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    let binary = new cv.Mat();
    cv.threshold(gray, binary, 150, 255, cv.THRESH_BINARY_INV);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      binary,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let detectedText = "";
    for (let i = 0; i < contours.size(); i++) {
      let cnt = contours.get(i);
      let rect = cv.boundingRect(cnt);

      if (
        rect.width > 10 &&
        rect.width < 50 &&
        rect.height > 10 &&
        rect.height < 50
      ) {
        detectedText += `Bubble at (x:${rect.x}, y:${rect.y})\n`;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    }

    setOutputText(detectedText);

    src.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
  };

  return (
    <div>
      <h2>OMR Bubble Detection</h2>
      {!cvReady && <p>Loading OpenCV...</p>}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef}></canvas>
      <pre>{outputText}</pre>
    </div>
  );
};

export default OmrProcessor;
