import React, { useState } from "react";
import "./styles/AccountCreation.css";

const AdminAccountCreation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "trainer", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account for ${formData.name} created successfully!`);
  };

  return (
    <div className="account-creation-container">
      <h2>Create Trainer Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="submit-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default AdminAccountCreation;
