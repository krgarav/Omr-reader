import { useEffect, useRef, useState } from "react";

import "./App.css";
import imgSrc from "./assets/53.jpg";
import TemplateEditor from "./Views/TemplateEditor";
import TimerPage from "./Component/Timer";
import PdfToSingleImage from "./Component/PdfMerger";
import { motion } from "framer-motion";
import Homepage from "./Views/Homepage";
function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [finalImage, setFinalImage] = useState(null); // Set this on submit

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "/node_modules/opencv.js/opencv.js";  // Adjust if needed
  //   script.async = true;
  //   script.onload = () => console.log("OpenCV.js Loaded!");
  //   document.body.appendChild(script);
  // }, []);
  const templateRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to a data URL for preview/storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Store base64 image in state
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e) => {
    if (templateRef.current.value === "") {
      alert("Please enter a template name");
      return;
    }
    if (!imagePreview) {
      alert("Please upload an image");
      return;
    }
    e.preventDefault(); // prevent form reload
    setFinalImage(imagePreview); // Set the final image on submit
  };
  return (
    <>
      {/* <OmrProcessor /> */}
      {/* {!finalImage && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Upload File</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <label>Template Name</label>
            <input type="text" ref={templateRef} />

            <button type="submit">Submit</button>
          </div>
        </form>
      )} */}

      {/* {!finalImage && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create Template
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                ref={templateRef}
                placeholder="Enter template name"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Submit
          </motion.button>
        </motion.form>
      )}

      {finalImage && (
        <TemplateEditor image={finalImage} title={templateRef.current.value} />
      )} */}
      {/* <CropperSelector/> */}
      {/* <TimerPage /> */}
      {/* <PdfToSingleImage/> */}
      <Homepage />
    </>
  );
}

export default App;
