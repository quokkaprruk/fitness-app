import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemberHome from "./pages/MemberHome";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemberHome />} />
        <Route path="/trainer" element={<TrainerHome />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </Router>
  );
};

export default App;
