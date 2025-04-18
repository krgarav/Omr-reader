import React from "react";

const FormData = ({
  setCurrentBoxData,
  currentBoxData,
  setBoxes,
  activeBox,
}) => {
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
              totalRow: enteredRow,
              totalCol: enteredCol,
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
          id="phone"
          name="phone"
          onChange={(e) => {
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
    </form>
  );
};

export default FormData;
