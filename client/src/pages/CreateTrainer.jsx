import { useState } from "react";
import "../pages/styles/CreateProfile.css";

const specialties = [
  "Cardio",
  "HIIT",
  "Yoga",
  "Weight Training",
  "Pilates",
  "Meditation",
];

const teachingModes = ["online", "onsite"];

const CreateTrainer = () => {
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    phone: "",
    specialty: [],
    teachingMode: "",
    experience: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecialtyChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setTrainerData({ ...trainerData, specialty: options });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Trainer profile created successfully!");
    setTrainerData({
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      phone: "",
      specialty: [],
      teachingMode: "",
      experience: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <form className="create-admin" onSubmit={handleSubmit}>
      {/* <div className="admin-page"> */}
      <h2>Create Trainer Profile</h2>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />
      <input
        type="text"
        name="specialty"
        placeholder="Specialty (comma-separated)"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="experience"
        placeholder="Years of Experience"
        onChange={handleChange}
        required
      />
      <button type="submit">Create Trainer</button>
    </form>
  );
};

export default CreateTrainer;
