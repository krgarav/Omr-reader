import React, { useState, useRef } from "react";
import "cropperjs/dist/cropper.css";

const MultipleCropper = () => {
  const [crops, setCrops] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [resizingIndex, setResizingIndex] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e, index = null, direction = null) => {
    if (!imageRef.current) return;
    const container = imageRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    if (index !== null && direction !== null) {
      setResizingIndex(index);
      setResizeDirection(direction);
      return;
    }

    const clickedBoxIndex = crops.findIndex(
      (crop) =>
        x >= crop.x &&
        x <= crop.x + crop.width &&
        y >= crop.y &&
        y <= crop.y + crop.height
    );

    if (clickedBoxIndex !== -1) {
      setDraggingIndex(clickedBoxIndex);
      setDragOffset({
        x: x - crops[clickedBoxIndex].x,
        y: y - crops[clickedBoxIndex].y,
      });
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });
    setCrops([...crops, { x, y, width: 0, height: 0, rows: 2, cols: 2 }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && resizingIndex === null && draggingIndex === null) return;
    const container = imageRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    setCrops((prevCrops) => {
      const updatedCrops = [...prevCrops];

      if (isDrawing && startPos) {
        updatedCrops[updatedCrops.length - 1] = {
          ...updatedCrops[updatedCrops.length - 1],
          x: Math.min(startPos.x, x),
          y: Math.min(startPos.y, y),
          width: Math.abs(x - startPos.x),
          height: Math.abs(y - startPos.y),
        };
      } else if (resizingIndex !== null && resizeDirection) {
        const crop = updatedCrops[resizingIndex];
        let newCrop = { ...crop };

        if (resizeDirection.includes("right")) {
          newCrop.width = Math.max(10, x - crop.x);
        }
        if (resizeDirection.includes("left")) {
          newCrop.width = Math.max(10, crop.x + crop.width - x);
          newCrop.x = x;
        }
        if (resizeDirection.includes("bottom")) {
          newCrop.height = Math.max(10, y - crop.y);
        }
        if (resizeDirection.includes("top")) {
          newCrop.height = Math.max(10, crop.y + crop.height - y);
          newCrop.y = y;
        }
        updatedCrops[resizingIndex] = newCrop;
      } else if (draggingIndex !== null) {
        const crop = updatedCrops[draggingIndex];
        updatedCrops[draggingIndex] = {
          ...crop,
          x: x - dragOffset.x,
          y: y - dragOffset.y,
        };
      }

      return updatedCrops;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setResizingIndex(null);
    setResizeDirection(null);
    setDraggingIndex(null);
    setDragOffset(null);
  };

  const handleDeleteCrop = (index) => {
    setCrops(crops.filter((_, i) => i !== index));
  };

  const handleGridChange = (index, type, value) => {
    setCrops((prevCrops) => {
      const updatedCrops = [...prevCrops];
      updatedCrops[index] = { ...updatedCrops[index], [type]: Number(value) };
      return updatedCrops;
    });
  };

  const submitHandler = ()=>{
    const image = imageRef.current;
    if (!image) return;

    const imageRect = image.getBoundingClientRect();
    const scaleX = image.naturalWidth / imageRect.width;
    const scaleY = image.naturalHeight / imageRect.height;

    const relativeCrops = crops.map((crop) => ({
      x: Math.round(crop.x * scaleX),
      y: Math.round(crop.y * scaleY),
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
      rows: crop.rows,
      cols: crop.cols,
    }));
    console.log(relativeCrops)

  }
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "80%",
          margin: "auto",
          textAlign: "center",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          ref={imageRef}
          src="https://res.cloudinary.com/dje269eh5/image/upload/v1722332055/omrimages/zjkq38asxfdcuo3xvzaj.jpg"
          style={{ width: "100%", height: "60vh", cursor: "crosshair" }}
          alt="Cropper"
        />

        {crops.map((crop, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div
              style={{
                position: "absolute",
                border: "2px solid red",
                left: `${crop.x}px`,
                top: `${crop.y}px`,
                width: `${crop.width}px`,
                height: `${crop.height}px`,
                background: "rgba(255, 255, 255, 0.3)",

                cursor: "move",
                display: "grid",
                gridTemplateColumns: `repeat(${crop.cols}, 1fr)`,
                gridTemplateRows: `repeat(${crop.rows}, 1fr)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, index)}
            >
              {Array.from({ length: crop.rows * crop.cols }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid black",
                    width: "100%",
                    height: "100%",
                  }}
                ></div>
              ))}
              <button
                onClick={() => handleDeleteCrop(index)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label>Cols:</label>
        <input
          type="number"
          //   value={crop.cols}
          //   onChange={(e) => handleGridChange(index, "cols", e.target.value)}
        />
        <label>Rows:</label>
        <input
          type="number"
          //   value={crop.rows}
          //   onChange={(e) => handleGridChange(index, "rows", e.target.value)}
        />
      </div>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
    </div>
  );
};

export default MultipleCropper;
