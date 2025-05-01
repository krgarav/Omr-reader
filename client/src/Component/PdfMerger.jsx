import React, { useState } from "react";
import { Document, Page } from "react-pdf"; // react-pdf is a wrapper for PDF.js
import html2canvas from "html2canvas";
import * as pdfjsLib from "pdfjs-dist"; // Use named import here

// Set the workerSrc for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PdfToImageConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Convert PDF to images
  // Convert PDF to images
  const convertPdfToImages = async (file) => {
    setLoading(true);
    const images = [];

    // Convert the File object to a URL
    const fileURL = URL.createObjectURL(file);

    try {
      const pdfDocument = await pdfjsLib.getDocument(fileURL).promise;
      const numPages = pdfDocument.numPages;

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);

        const scale = 1.5; // scale factor for better image quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to image (base64)
        const image = canvas.toDataURL();
        images.push(image);
      }

      setImageList(images);
    } catch (error) {
      console.error("Error converting PDF to images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the PDF conversion when a file is uploaded
  const handlePdfUpload = () => {
    if (pdfFile) {
      convertPdfToImages(pdfFile);
    }
  };
  // Merge all images into a single image
  const mergeImagesIntoSingle = () => {
    if (imageList.length === 0) {
      alert("No images to merge!");
      return;
    }

    // Create a new canvas to hold all images
    const totalWidth = Math.max(
      ...imageList.map((image) => {
        const img = new Image();
        img.src = image;
        return img.width;
      })
    );

    const totalHeight = imageList.reduce((acc, image) => {
      const img = new Image();
      img.src = image;
      return acc + img.height;
    }, 0);

    const canvas = document.createElement("canvas");
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d");

    let currentY = 0;

    // Draw each image on the canvas
    imageList.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, currentY);
        currentY += img.height;

        // Once all images are drawn, convert the canvas to a data URL
        if (currentY === totalHeight) {
          const mergedImage = canvas.toDataURL();
          // You can display it or download it
          const imgElement = document.createElement("img");
          imgElement.src = mergedImage;
          document.body.appendChild(imgElement); // For demo purposes
        }
      };
    });
  };

  return (
    <div>
      <h1>Convert PDF to Images</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handlePdfUpload} disabled={loading || !pdfFile}>
        {loading ? "Converting..." : "Convert PDF to Images"}
      </button>

      {loading && <p>Loading...</p>}

      <div>
        {imageList.length > 0 &&
          imageList.map((image, index) => (
            <div key={index}>
              <h3>Page {index + 1}</h3>
              <img
                src={image}
                alt={`PDF Page ${index + 1}`}
                style={{ width: "100%", maxWidth: "600px" }}
              />
            </div>
          ))}
        <button
          onClick={mergeImagesIntoSingle}
          disabled={imageList.length === 0}
        >
          Merge All Images into One
        </button>
      </div>
    </div>
  );
};

export default PdfToImageConverter;
