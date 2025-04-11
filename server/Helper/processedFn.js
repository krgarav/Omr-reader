function processBubbles(gridConfig, bubbles) {
  const {
    Total_Row,
    Total_Col,
    imageWidth,
    imageHeight,
    offsetX,
    offsetY,
    readingDirection,
    totalFields,
    fieldType
  } = gridConfig;
  const data = calculateGridProperties(
    imageWidth,
    imageHeight,
    Total_Row,
    Total_Col
  );
  const row_Height = data.row_Height;
  const col_Width = data.col_Width;

  // Define column letters
  // const columnLetters = ["A", "B", "C", "D"];
  const columnLetters= generateArrOfFields(fieldType,totalFields)

  // Create a result array filled with blanks
  let result = new Array(Total_Row).fill("blank");

  function getRowIndex(y) {
    return Math.floor((y - offsetY) / row_Height);
  }

  function getColumnIndex(x) {
    return Math.floor((x - offsetX) / col_Width);
  }

  // Process each detected bubble
  bubbles.forEach(({ x, y }) => {
    let rowIndex = getRowIndex(y);
    let colIndex = getColumnIndex(x);

    if (
      rowIndex >= 0 &&
      rowIndex < Total_Row &&
      colIndex >= 0 &&
      colIndex < Total_Col
    ) {
      if (readingDirection !== "topToBottom") {
        result[colIndex] = columnLetters[rowIndex];
      } else {
        result[rowIndex] = columnLetters[colIndex]; // Map column index to A, B, C, D
      }
    }
  });

  // Format output
  return result.map((val, idx) => `Col ${idx + 1} ${val}`).join(" , ");
}

function calculateGridProperties(
  imageWidth,
  imageHeight,
  totalRows,
  totalCols
) {
  return {
    row_Height: Math.floor(imageHeight / totalRows),
    col_Width: Math.floor(imageWidth / totalCols),
  };
}
function generateArrOfFields(fieldType, totalFields) {
  const arr = [];
  if (fieldType === "alpha") {
    for (let i = 0; i < totalFields; i++) {
      arr.push(String.fromCharCode(65 + i)); // 65 is ASCII value of 'A'
    }
  } else {
    for (let i = 0; i < totalFields; i++) {
      arr.push(i);
    }
  }
  return arr;
}

module.exports = processBubbles;
