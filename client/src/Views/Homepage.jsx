import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import TemplateEditor from "./TemplateEditor";
const Homepage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [finalImage, setFinalImage] = useState(null); // Set this on submit
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
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-gray-100 to-blue-500 flex flex-col items-center justify-start px-4 py-10 relative">
        {!finalImage && (
          <h1 className="text-3xl font-bold text-center mt-10">OMR Reader</h1>
        )}
        {!finalImage && (
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
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 transition"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <TemplateEditor
            image={finalImage}
            title={templateRef.current.value}
          />
        )}
      </div>
    </div>
  );
};

export default Homepage;
