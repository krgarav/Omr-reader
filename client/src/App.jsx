import { useEffect, useRef, useState } from "react";

import "./App.css";
import imgSrc from "./assets/53.jpg";
import TemplateEditor from "./Views/TemplateEditor";
import TimerPage from "./Component/Timer";
import PdfToSingleImage from "./Component/PdfMerger";
import { motion } from "framer-motion";
import Homepage from "./Views/Homepage";
import { Routes, Route, Navigate } from "react-router-dom";
import AllTemplates from "./Views/AllTemplates";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllTemplates />} />
        <Route path="/create-template" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
