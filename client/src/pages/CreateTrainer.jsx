import React, { useState } from "react";
import "./Admin.css";

const CreateTrainer = () => {
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
    email: "",
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
    specialty: [],
    teachingMode: [],
    experience: "",
  });

  const handleChange = (e) => {
    setTrainerData({ ...trainerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Trainer Profile Data:", trainerData);
  };

  return (
    <form className="create-trainer" onSubmit={handleSubmit}>
      <h2>Create Trainer Profile</h2>
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} />
      <input type="text" name="specialty" placeholder="Specialty (comma-separated)" onChange={handleChange} required />
      <input type="number" name="experience" placeholder="Years of Experience" onChange={handleChange} required />
      <button type="submit">Create Trainer</button>
    </form>
  );
};

export default CreateTrainer;
