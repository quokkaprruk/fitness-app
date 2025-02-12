import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewUser from "./pages/NewUser";
import MemberHome from "./pages/MemberHome";
import TrainerHome from "./pages/TrainerHome";
import AdminHome from "./pages/AdminHome";
import Login from "./pages/Login";
import ClassList from "./pages/ClassListing";
import Signup from "./pages/SignUp";
<<<<<<< HEAD
=======
import MembershipPage from "./pages/MembershipPage";
import PricingPage from "./pages/PricingPage";
import RegistrationForm from "./pages/RegistrationForm";
import ContactPage from "./pages/ContactPage";
>>>>>>> d91dfa20f0c75a68c0eca259ce3009ffb5b67a14

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
        <Route path="/membership" element={<MembershipPage />} />{" "}
        {/* Membership Page */}
        <Route path="/pricing" element={<PricingPage />} /> {/* Pricing Page */}
        <Route path="/register" element={<RegistrationForm />} />{" "}
        {/* RegistrationForm */}
        <Route path="/contact" element={<ContactPage />} />{" "}
        {/* Contact Page */}
      </Routes>
    </Router>
  );
};

export default App;
