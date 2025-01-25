import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewUser from "./pages/NewUser";
import MemberHome from "./pages/MemberHome";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";
import Login from "./pages/Login";
import ClassList from "./pages/ClassListing";
import Signup from "./pages/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewUser />} /> {/* Homepage */}
        <Route path="/member" element={<MemberHome />} /> {/* Member Home */}
        <Route path="/trainer" element={<TrainerHome />} /> {/* Trainer Home */}
        <Route path="/admin" element={<AdminHome />} /> {/* Admin Home */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/classes" element={<ClassList />} /> {/* Class Listing */}
        <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
      </Routes>
    </Router>
  );
};

export default App;
