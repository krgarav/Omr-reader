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
    fieldType,
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
  const columnLetters = generateArrOfFields(fieldType, totalFields);

  // const row = readingDirection === "topToBottom" ? Total_Row : Total_Col;
  // let result = new Array(row).fill("blank");

  function getRowIndex(y) {
    return Math.floor((y - offsetY) / row_Height);
  }

  function getColumnIndex(x) {
    return Math.floor((x - offsetX) / col_Width);
  }
  const row = readingDirection !== "topToBottom" ? Total_Row : Total_Col;
  let result = new Array(row).fill("blank");
  // if (readingDirection !== "topToBottom") {
  //   for (let i = 0; i < Total_Row; i++) {
  //     for (let j = 0; j < Total_Col; j++) {
  //       if (bubbles[i + j]) {
  //         const bubbleData = bubbles[i + j];
  //         let rowIndex = getRowIndex(bubbleData.y);
  //         let colIndex = getColumnIndex(bubbleData.x);

  //         if (
  //           rowIndex >= 0 &&
  //           rowIndex < Total_Row &&
  //           colIndex >= 0 &&
  //           colIndex < Total_Col
  //         ) {
  //           result[rowIndex] = columnLetters[colIndex];
  //         }
  //       }
  //     }
  //   }

  //   // Format output
  //   return result.map((val, idx) => `Row ${idx + 1} ${val}`).join(" , ");
  // } else {
  //   for (let i = 0; i < Total_Col; i++) {
  //     for (let j = 0; j < Total_Row; j++) {
  //       if (bubbles[i + j]) {
  //         const bubbleData = bubbles[i + j];
  //         let rowIndex = getRowIndex(bubbleData.y);
  //         let colIndex = getColumnIndex(bubbleData.x);

  //         if (
  //           rowIndex >= 0 &&
  //           rowIndex < Total_Row &&
  //           colIndex >= 0 &&
  //           colIndex < Total_Col
  //         ) {
  //           result[rowIndex] = columnLetters[colIndex];
  //         }
  //       }
  //     }
  //   }
  //   return result.map((val, idx) => `Col ${idx + 1} = ${val}`).join(" , ");
  // }

  if (readingDirection !== "topToBottom") {
    bubbles.forEach((bubbleData) => {
      const rowIndex = getRowIndex(bubbleData.y);
      const colIndex = getColumnIndex(bubbleData.x);

      if (
        rowIndex >= 0 &&
        rowIndex < Total_Row &&
        colIndex >= 0 &&
        colIndex < Total_Col
      ) {
        result[colIndex] = columnLetters[rowIndex];
      }
    });

    return result.map((val, idx) => `Col ${idx + 1} = ${val}`).join(" , ");
  } else {
    bubbles.forEach((bubbleData) => {
      const rowIndex = getRowIndex(bubbleData.y);
      const colIndex = getColumnIndex(bubbleData.x);

      if (
        rowIndex >= 0 &&
        rowIndex < Total_Row &&
        colIndex >= 0 &&
        colIndex < Total_Col
      ) {
        result[rowIndex] = columnLetters[colIndex];
      }
    });

    return result.map((val, idx) => `Row ${idx + 1} = ${val}`).join(" , ");
  }
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
