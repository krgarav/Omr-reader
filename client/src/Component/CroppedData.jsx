import React from "react";
import { useSelector } from "react-redux";
const CroppedData = () => {
  const coordinates = useSelector((state) => {
    console.log(state.coordinate.coordinates)
    state.coordinate.coordinates;
  });

console.log(coordinates)
//   const allCoordinates = coordinates.map()
  return <div>CroppedData</div>;
};

export default CroppedData;
