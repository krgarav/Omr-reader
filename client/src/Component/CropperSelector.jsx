import React from "react";
import { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState } from "react";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import CroppedData from "./CroppedData";
const CropperSelector = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [allCoordinates, setAllCoordinates] = useState([]);
  const [cropBoxes, setCropBoxes] = useState([]);
  const [boxData, setSetBoxData] = useState([]);

  const dispatch = useDispatch();
  const cropperRef = useRef(null);
  console.log(cropBoxes);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cropperRef.current?.cropper) {
        const cropper = cropperRef.current.cropper;

        // Ensure both getImageData() and getCanvasData() are available
        if (
          typeof cropper.getImageData === "function" &&
          typeof cropper.getCanvasData === "function"
        ) {
          const imageData = cropper.getImageData();
          const canvasData = cropper.getCanvasData();

          if (!imageData || !canvasData) {
            console.warn(
              "imageData or canvasData is undefined, skipping calculation."
            );
            return;
          }
          console.log(cropBoxes);
          if (cropBoxes.length > 0) {
            const boxes = cropBoxes.map((item, index) => {
              // 🔥 Adjust for zoom and position using canvasData
              const scaleX = canvasData.width / imageData.naturalWidth;
              const scaleY = canvasData.height / imageData.naturalHeight;
              const relativeTop = item.topLeftY * scaleY + canvasData.top;
              const relativeLeft = item.topLeftX * scaleX + canvasData.left;
              const relativeWidth =
                (item.bottomRightX - item.topLeftX) * scaleX;
              const relativeHeight =
                (item.bottomRightY - item.topLeftY) * scaleY;
              return (
                <div
                  key={index}
                  onClick={handleBoxClick}
                  style={{
                    position: "absolute",
                    top: `${relativeTop}px`,
                    left: `${relativeLeft}px`,
                    width: `${relativeWidth}px`,
                    height: `${relativeHeight}px`,
                    border: "2px solid red",
                    pointerEvents: "none",
                    zIndex: 999,
                  }}
                ></div>
              );
            });
            console.log(boxes);
            setAllCoordinates(boxes);
          }
        } else {
          console.warn(
            "cropper.getImageData or cropper.getCanvasData is not available yet."
          );
        }
      }
    }, 60); // Slight delay to ensure Cropper is ready

    return () => clearTimeout(timeoutId); // Cleanup function to prevent memory leaks
  }, [cropData, cropBoxes]);
  console.log(allCoordinates);
  const handleBoxClick = (event) => {
    console.log(event.target);
  };
  const getCropData = () => {
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    // Calculate coordinates relative to the original image
    const scaleX = imageData.naturalWidth / imageData.width;
    const scaleY = imageData.naturalHeight / imageData.height;

    const coordinates = {
      topLeftX: (cropBoxData.left - canvasData.left) * scaleX,
      topLeftY: (cropBoxData.top - canvasData.top) * scaleY,
      bottomRightX:
        (cropBoxData.left - canvasData.left + cropBoxData.width) * scaleX,
      bottomRightY:
        (cropBoxData.top - canvasData.top + cropBoxData.height) * scaleY,
    };

    const relativeCoordinates = {
      topLeftX: cropBoxData.left - canvasData.left,
      topLeftY: cropBoxData.top - canvasData.top,
      bottomRightX: cropBoxData.left - canvasData.left + cropBoxData.width,
      bottomRightY: cropBoxData.top - canvasData.top + cropBoxData.height,
    };

    setCropData({
      coordinates,
      relativeCoordinates,
      croppedImage: cropper.getCroppedCanvas().toDataURL(),
    });
  };

  const saveHandler = () => {
    if (cropData) {
      //   const obj = cropData?.relativeCoordinates;
      const obj = cropData?.coordinates;
      console.log(obj);
      // dispatch(obj)
      setCropBoxes((prev) => {
        return [...prev, obj];
      });
      const { topLeftX, topLeftY, bottomRightX, bottomRightY } =
        cropData.coordinates;

      const obj2 = {
        x: topLeftX,
        y: topLeftY,
        width: bottomRightX - topLeftX,
        height: bottomRightY - topLeftY,
      };

      setSetBoxData((prev) => [...prev, obj2]);
    }
  };
  const clearSelection = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.clear();
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to a data URL for preview/storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store base64 image in state
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(cropData);
  return (
    <div>
      <div>
        <label>Upload File</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <CroppedData />
      <div className="border border-primary" style={{ position: "relative" }}>
        <Cropper
          src={image}
          style={{ height: "80dvh" }}
          initialAspectRatio={1}
          guides={true}
          ref={cropperRef}
          cropend={() => getCropData()}
          //   zoom={() => updateCoordinates()} // 🔥 Update boxes on zoom
          //   cropmove={() => updateCoordinates()}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={true}
          responsive={true}
          autoCropArea={0}
          checkOrientation={false}
          rotatable={true}
          autoCrop={false}
          zoomable={true}
        />
        {allCoordinates}
      </div>
      <div className="d-flex justify-content-center flex-grow-1">
        <button
          // active={currentImage === imageSrc}
          onClick={saveHandler}
        >
          save
        </button>
        <button
          // active={currentImage === imageSrc}
          onClick={clearSelection}
        >
          Clear selection
        </button>
      </div>
      <div>
        {boxData.length > 0 && (
          <table
            border="1"
            cellPadding="10"
            style={{ marginTop: "20px", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>X</th>
                <th>Y</th>
                <th>Width</th>
                <th>Height</th>
              </tr>
            </thead>
            <tbody>
              {boxData.map((box, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{box.x.toFixed(2)}</td>
                  <td>{box.y.toFixed(2)}</td>
                  <td>{box.width.toFixed(2)}</td>
                  <td>{box.height.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CropperSelector;
