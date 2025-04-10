function processBubbles(gridConfig, bubbles) {
  const { Total_Row, Total_Col, imageWidth, imageHeight } = gridConfig;
  console.log(imageWidth,imageHeight)
  const data = calculateGridProperties(imageWidth, imageHeight, Total_Row, Total_Col);
  const row_Height = data.row_Height;
  const col_Width = data.col_Width;

  // Define column letters
  const columnLetters = ["A", "B", "C", "D"];

  // Create a result array filled with blanks
  let result = new Array(Total_Row).fill("blank");

  // Function to determine row index based on 'y' position
  function getRowIndex(y) {
    return Math.floor(y / row_Height);
  }

  // Function to determine column index based on 'x' position
  function getColumnIndex(x) {
    return Math.floor(x / col_Width);
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
      result[rowIndex] = columnLetters[colIndex]; // Map column index to A, B, C, D
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

module.exports = processBubbles;
