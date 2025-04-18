import { useEffect, useState } from "react";

import "./App.css";
import imgSrc from "./assets/img.jpg";
import TemplateEditor from "./Views/TemplateEditor";
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
      <TemplateEditor image={imgSrc} />
      {/* <CropperSelector/> */}
    </>
  );
}

export default App;
