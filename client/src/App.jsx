import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemberHome from "./pages/MemberHome";
import TrainerHome from "./pages/TrainerHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemberHome />} />
        <Route path="/trainer" element={<TrainerHome />} />
      </Routes>
    </Router>
  );
};

export default App;
