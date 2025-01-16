import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewUser from "./pages/NewUser";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewUser />} />
        <Route path="/trainer" element={<TrainerHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/login" element = {<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
