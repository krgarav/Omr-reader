function processBubbles(gridConfig, bubbles) {
  const { Total_Row, Total_Col, row_Height, col_Width } = gridConfig;

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
  return result.map((val, idx) => `row${idx + 1} ${val}`).join(" , ");
}

// Example grid configuration
const gridConfig = {
  Total_Row: 5,
  Total_Col: 4,
  row_Height: 34, // Adjust based on actual grid spacing
  col_Width: 50, // Adjust based on actual column width
  fieldType: "alpha",
  readingDirection: "top to bottom",
};

// Example detected bubbles from OpenCV
const detectedBubbles = {
  bubbles: [
    { height: 19, width: 17, x: 95, y: 16 }, // Should map to Row 1, Column B
    { height: 18, width: 21, x: 34, y: 79 }, // Should map to Row 2, Column A
  ],
  success: true,
};

// Run function
console.log(processBubbles(gridConfig, detectedBubbles.bubbles));
