import { useEffect, useState } from "react";

import "./App.css";
import imgSrc from "./assets/53.jpg";
import TemplateEditor from "./Views/TemplateEditor";
function App() {
  const [image, setImage] = useState(null);
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "/node_modules/opencv.js/opencv.js";  // Adjust if needed
  //   script.async = true;
  //   script.onload = () => console.log("OpenCV.js Loaded!");
  //   document.body.appendChild(script);
  // }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to a data URL for preview/storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store base64 image in state
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {/* <OmrProcessor /> */}
      <div>
        <label>Upload File</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      {image && <TemplateEditor image={image} />}
      {/* <CropperSelector/> */}
    </>
  );
}

export default App;
