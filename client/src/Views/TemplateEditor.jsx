import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import FormData from "../Component/FormData";
import classes from "./Template.module.css";
const TemplateEditor = ({ image }) => {
  const [boxes, setBoxes] = useState([
    {
      x: 50,
      y: 50,
      width: 150,
      height: 100,
      totalCol: 8,
      totalRow: 10,
      gap: 1,
    },
  ]);
  const [activeBox, setActiveBox] = useState(null);
  const [currentBoxData, setCurrentBoxData] = useState(null);
  const imageRef = useRef(null);

  const updateBox = (index, newProps) => {
    setBoxes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      return copy;
    });
  };

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        x: 100,
        y: 100,
        width: 150,
        height: 100,
        totalCol: 8,
        totalRow: 10,
        gap:1,
      },
    ]);
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
    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;

    return {
      x: Math.round(x * scaleX),
      y: Math.round(y * scaleY),
      width: Math.round(width * scaleX),
      height: Math.round(height * scaleY),
    };
  };
 
  const selectedFields = boxes.map((box, index) => {
    const style = index !== activeBox ? classes.activeField : classes.notActive;
    return (
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
        onClick={() => {
          setActiveBox(index);
          setCurrentBoxData(box);
        }}
        // disableDragging={index !== activeBox}
      >
        <div className={style}>
          {Array.from({ length: box.totalCol }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: "flex",
                // justifyContent: "space-evenly",
                gap: `${box.gap}px`,
                alignItems: "center",
                width: "100%",
                height: `${100 / box.totalCol}%`,
              }}
            >
              {Array.from({ length: box.totalRow }).map((_, colIdx) => (
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
    );
  });

  const getBubbleCoordinates = (box, imageRef, boxPadding = 0, gap) => {
    const image = imageRef.current;
    if (!image) return [];
    // const gap= 12
    const scaleX = image.naturalWidth / image.clientWidth;
    const scaleY = image.naturalHeight / image.clientHeight;

    const rows = box.totalCol; // vertical count
    const cols = box.totalRow; // horizontal count

    // Area inside the box (excluding optional padding)
    const innerX = box.x + boxPadding + gap;
    const innerY = box.y + boxPadding;
    const innerWidth = box.width - 2 * boxPadding * gap;
    const innerHeight = box.height - 2 * boxPadding;

    // Row and bubble sizing
    const rowHeight = innerHeight / rows;
    const bubbleHeight = rowHeight * 0.8;
    const bubbleWidth = bubbleHeight; // keeping it a circle

    // Horizontal spacing (space-evenly style)
    const spaceBetweenBubbles = (innerWidth - cols * bubbleWidth) / (cols + 1);

    const bubbles = [];

    for (let row = 0; row < rows; row++) {
      const rowY = innerY + row * rowHeight;
      const bubbleY = rowY + (rowHeight - bubbleHeight) / 2;

      for (let col = 0; col < cols; col++) {
        const bubbleX =
          innerX +
          spaceBetweenBubbles * (col + 1) + // equal space before each bubble
          bubbleWidth * col;

        bubbles.push({
          x: Math.floor(bubbleX * scaleX + gap),
          y: Math.floor(bubbleY * scaleY),
          width: Math.floor(bubbleWidth * scaleX),
          height: Math.floor(bubbleHeight * scaleY),
          row,
          col,
        });
      }
    }

    return bubbles;
  };

  const allBubbles = boxes.flatMap((box) =>
    getBubbleCoordinates(box, imageRef, 0, 0)
  );

  return (
    <div>
      <section style={{ display: "flex" }}>
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

          {selectedFields}
        </div>
        <div>
          <FormData
            setCurrentBoxData={setCurrentBoxData}
            currentBoxData={currentBoxData}
            setBoxes={setBoxes}
            activeBox={activeBox}
          />
        </div>
      </section>
      <div style={{ marginTop: "10px" }}>
        <button onClick={addBox}>Add Box</button>
        <h4>Image Coordinates (based on natural image size):</h4>
        <pre>{JSON.stringify(boxes.map(getImageCoordinates), null, 2)}</pre>
        <pre>{JSON.stringify(allBubbles, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TemplateEditor;
