import React, { useState } from "react";
import "./styles/RegistrationForm.css";
import Confetti from "react-confetti";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.password) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000); // Confetti for 4 seconds
      setFormData({ name: "", email: "", password: "" });
    } else {
      setError(true);
    }
  };

  return (
    <div className="registration-container">
      {submitted && <Confetti numberOfPieces={150} recycle={false} />}
      <h2>Register for Membership</h2>
      <form
        onSubmit={handleSubmit}
        className={`registration-form ${error ? "shake" : ""}`}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>

      {submitted && (
        <div className="success-message">
          🎉 Welcome! Your registration was successful.
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;

