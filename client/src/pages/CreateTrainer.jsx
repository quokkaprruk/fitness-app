import { useState } from "react";
import "../pages/styles/CreateProfile.css";

const specialties = [
  "Yoga", "Pilates", "Zumba", "HIIT", "Cardio", "Strength Training", "CrossFit"
];

const teachingModes = ["Online", "Onsite", "Both"];

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
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
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
    <div className="admin-page">
      <h2>Create Trainer Profile</h2>
      <form onSubmit={handleSubmit} className="trainer-form">
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
        <select name="gender" value={trainerData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          name="dob"
          value={trainerData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={trainerData.phone}
          onChange={handleChange}
          required
        />
        <label>Specialties (Select multiple):</label>
        <select
          name="specialty"
          multiple
          value={trainerData.specialty}
          onChange={handleSpecialtyChange}
          required
        >
          {specialties.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          name="teachingMode"
          value={trainerData.teachingMode}
          onChange={handleChange}
          required
        >
          <option value="">Select Teaching Mode</option>
          {teachingModes.map((mode, index) => (
            <option key={index} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={trainerData.experience}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={trainerData.username}
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
          type="password"
          name="password"
          placeholder="Password"
          value={trainerData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Trainer</button>
      </form>
    </div>
  );
};

export default CreateTrainer;