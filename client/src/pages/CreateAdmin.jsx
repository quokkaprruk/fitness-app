import React, { useState } from "react";
import "./CreateAdmin.css";

const CreateAdmin = () => {
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postal: "",
    country: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    condition: "",
    allergy: "",
  });

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Profile Data:", adminData);
  };

  return (
    <form className="create-admin" onSubmit={handleSubmit}>
      <h2>Create Admin Profile</h2>
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} />
      <input type="text" name="city" placeholder="City" onChange={handleChange} />
      <button type="submit">Create Admin</button>
    </form>
  );
};

export default CreateAdmin;
