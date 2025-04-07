import { useState } from "react";
import "../pages/styles/CreateProfile.css";
import axios from "axios";

const specialties = [
  "Cardio",
  "HIIT",
  "Yoga",
  "Weight Training",
  "Pilates",
  "Meditation",
];

const teachingModes = ["online", "on-site"];

const CreateTrainer = () => {
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
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
    const { value, checked } = e.target;
    setTrainerData((prevData) => {
      if (checked) {
        return {
          ...prevData,
          specialty: [...prevData.specialty, value],
        };
      } else {
        return {
          ...prevData,
          specialty: prevData.specialty.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      ...trainerData,
      role: "trainer", 
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/signup`,
        payload
      );
  
      if (response.status === 201) {
        alert("Trainer profile created successfully!");
        setTrainerData({
          firstName: "",
          lastName: "",
          gender: "",
          dateOfBirth: "",
          phone: "",
          specialty: [],
          teachingMode: "",
          experience: "",
          username: "",
          email: "",
          password: "",
        });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "An error occurred while creating the trainer.";
      alert(errorMsg);
      console.error("Signup error:", error);
    }
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
        <select
          name="gender"
          value={trainerData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          name="dateOfBirth"
          value={trainerData.dateOfBirth}
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
        
        <div className="specialty-checkbox-group">
          <label>Specialties:</label>
          <div className="checkbox-options">
            {specialties.map((spec, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  name="specialty"
                  value={spec}
                  checked={trainerData.specialty.includes(spec)}
                  onChange={handleSpecialtyChange}
                />
                {spec}
              </label>
            ))}
          </div>
        </div>

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