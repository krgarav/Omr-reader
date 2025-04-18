import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";

const MultiCropper = ({ image }) => {
  const [boxes, setBoxes] = useState([
    { x: 50, y: 50, width: 150, height: 100 },
  ]);
  const imageRef = useRef(null);

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

  const getImageCoordinates = (box) => {
    const { x, y, width, height } = box;

    const img = imageRef.current;
    if (!img) return box;

    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    console.log(naturalWidth);
    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;

    return {
      x: Math.round(x * scaleX),
      y: Math.round(y * scaleY),
      width: Math.round(width * scaleX),
      height: Math.round(height * scaleY),
    };
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          border: "1px solid #ccc",
        }}
      >
        <img
          ref={imageRef}
          src={image}
          alt="to crop"
          style={{
            display: "block",
            maxWidth: "100%",
            height: "80vh",
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
              {Array.from({ length: 10 }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    height: `${100 / 10}%`,
                  }}
                >
                  {Array.from({ length: 8 }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      style={{
                        aspectRatio: "1",
                        height: "80%",
                        borderRadius: "50%",
                        border: "1px solid black",
                        backgroundColor: "transparent",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}
                </div>
              ))}
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
                  zIndex: 9990,
                  color: "cadetblue",
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
        <h4>Image Coordinates (based on natural image size):</h4>
        <pre>{JSON.stringify(boxes.map(getImageCoordinates), null, 2)}</pre>
      </div>
    </div>
  );
};

export default MultiCropper;
