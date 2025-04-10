import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import OmrProcessor from "./Component/Omeuploader";
import MultiCrop from "./Component/MultipleCropper";
import CropperSelector from "./Component/CropperSelector";
import MultiCropper from "./Component/MultipleCropper";
import imgSrc from "./assets/img.jpg";
function App() {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "/node_modules/opencv.js/opencv.js";  // Adjust if needed
  //   script.async = true;
  //   script.onload = () => console.log("OpenCV.js Loaded!");
  //   document.body.appendChild(script);
  // }, []);
  
  return (
    <>
      {/* <OmrProcessor /> */}
      <MultiCropper  image={imgSrc} />
      {/* <CropperSelector/> */}
    </>
  );
}

export default App;
