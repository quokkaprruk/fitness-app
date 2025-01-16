import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewUser from "./pages/NewUser";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewUser />} />
        <Route path="/trainer" element={<TrainerHome />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </Router>
  );
};

export default App;
