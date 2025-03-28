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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate trainer creation (no backend call)
    alert("Trainer profile created successfully!");

    // Reset form
    setTrainerData({
      firstName: "",
      lastName: "",
      email: "",
      specialization: "",
      experience: "",
    });
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
          placeholder="Specialization (comma-separated)"
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

