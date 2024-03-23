// import { useState } from 'react'

import { Home } from "./pages/Home";
import { Map } from "./pages/Map";
import { Routes, Route } from "react-router-dom";
// import Gemini from "./components/Gemini";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchJobs" element={<Map />} />
      </Routes>
    </>
  );
}

export default App;
