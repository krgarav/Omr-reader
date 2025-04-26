import React from "react";

const FormData = ({
  setCurrentBoxData,
  currentBoxData,
  setBoxes,
  activeBox,
  allBubbles,
}) => {
  const downloadHandler = () => {
    const jsondata = allBubbles[activeBox];
    const dataStr = JSON.stringify(jsondata, null, 2); // Convert to formatted JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const enteredRow = e.target[0].value;
    const enteredCol = e.target[1].value;
    const enteredGap = e.target[2].value;

    setBoxes((prevBoxes) =>
      prevBoxes.map((box, idx) =>
        idx === activeBox
          ? {
              ...box,
              totalCol: enteredRow,
              totalRow: enteredCol,
              gap: enteredGap,
            }
          : box
      )
    );
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        <label for="totalRow">Col:</label>
        <input
          type="number"
          id="totalRow"
          name="firstName"
          value={currentBoxData?.totalRow}
          onChange={(e) =>
            setCurrentBoxData((prev) => ({
              ...prev,
              totalRow: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label for="totalCol">Row:</label>
        <input
          type="number"
          id="totalCol"
          name="lastName"
          value={currentBoxData?.totalCol}
          onChange={(e) =>
            setCurrentBoxData((prev) => ({
              ...prev,
              totalCol: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label for="margin">Margin:</label>
        <input
          type="range"
          min={0}
          max={20}
          step={0.1}
          id="phone"
          name="phone"
          onChange={(e) => {
            console.log(e.target.value);
            setCurrentBoxData(() => {
              return { ...currentBoxData, gap: e.target.value };
            });
            setBoxes((prevBoxes) =>
              prevBoxes.map((box, idx) =>
                idx === activeBox ? { ...box, gap: e.target.value } : box
              )
            );
          }}
        />
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={downloadHandler}>
        Download Data
      </button>
    </form>
  );
};

export default FormData;
