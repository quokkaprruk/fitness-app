import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemberHome from "./pages/MemberHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemberHome />} />
      </Routes>
    </Router>
  );
};

export default App;
