import { useState } from "react";
import "../pages/styles/Admin.css";

const CreateTrainer = () => {
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    experience: "",
  });

  const handleChange = (e) => {
    setTrainerData({ ...trainerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/trainers", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(trainerData),
   });

      if (!response.ok) {
        throw new Error("Failed to create trainer");
      }

      console.log("Trainer Profile Created:", trainerData);
      alert("Trainer profile created successfully!");
      setTrainerData({
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
        experience: "",
      });
    } catch (error) {
      console.error("Error creating trainer:", error);
      alert("Error creating trainer");
    }
  };

  return (
    <div className="admin-page">
      <h2>Create Trainer Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={trainerData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={trainerData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={trainerData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={trainerData.specialization}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={trainerData.experience}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Trainer</button>
      </form>
    </div>
  );
};

export default CreateTrainer;

