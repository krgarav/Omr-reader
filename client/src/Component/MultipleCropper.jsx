import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";

const MultiCropper = ({ image }) => {
  const [boxes, setBoxes] = useState([
    { x: 50, y: 50, width: 150, height: 100 },
  ]);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imageDims, setImageDims] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateImagePosition = () => {
      const img = imageRef.current;
      const container = containerRef.current;
      if (img && container) {
        const rect = img.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setImageDims({
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };
  
    window.addEventListener("resize", updateImagePosition);
    return () => window.removeEventListener("resize", updateImagePosition);
  }, []);
  

  const updateBox = (index, newProps) => {
    setBoxes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      return copy;
    });
  };

  const addBox = () => {
    setBoxes((prev) => [...prev, { x: 100, y: 100, width: 150, height: 100 }]);
  };

  const removeBox = (index) => {
    setBoxes((prev) => prev.filter((_, i) => i !== index));
  };
  const handleImageLoad = () => {
    const img = imageRef.current;
    const container = containerRef.current;
  
    if (img && container) {
      const rect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
  
      setNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
  
      setImageDims({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };
  
  // Convert box coordinates from container space to image space
  const getImageCoordinates = (box) => {
    const { x, y, width, height } = box;
console.log(x, y, width, height)
    const naturalWidth = imageRef.current?.naturalWidth || 1;
    const naturalHeight = imageRef.current?.naturalHeight || 1;

    const renderedWidth = imageDims.width;
    const renderedHeight = imageDims.height;
    const offsetLeft = imageDims.left;
    const offsetTop = imageDims.top;

    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;

    return {
      x: Math.round((x - offsetLeft) * scaleX),
      y: Math.round((y - offsetTop) * scaleY),
      width: Math.round(width * scaleX),
      height: Math.round(height * scaleY),
    };
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: `${naturalSize.width}px`,
          height: `${naturalSize.height}px`,
          overflow: "hidden",
          border: "1px solid #ccc",
          margin: "0 auto", // center horizontally
        }}
      >
        <img
          ref={imageRef}
          src={image}
          alt="to crop"
          onLoad={handleImageLoad}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {boxes.map((box, index) => (
          <Rnd
            key={index}
            size={{ width: box.width, height: box.height }}
            position={{ x: box.x, y: box.y }}
            onDragStop={(e, d) => {
              updateBox(index, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateBox(index, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                border: "2px solid red",
                position: "relative",
              }}
            >
              <button
                onClick={() => removeBox(index)}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  background: "#fff",
                  border: "1px solid red",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "18px",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          </Rnd>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={addBox}>Add Box</button>
        <h4>Normalized Image Coordinates:</h4>
        <pre>{JSON.stringify(boxes.map(getImageCoordinates), null, 2)}</pre>
      </div>
    </div>
  );
};

export default MultiCropper;
