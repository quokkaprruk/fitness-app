import axios from "axios";
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
    specialty: "",
    teachingMode: "",
    experience: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTrainerData({ ...trainerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/trainers/create`,
        {
          ...trainerData,
          specialty: trainerData.specialty.split(",").map((s) => s.trim()), // Convert to an array
          teachingMode: trainerData.teachingMode.split(",").map((m) => m.trim()), // Convert to an array
        }
      );
      setMessage("Trainer created successfully!");
      setTrainerData({
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
        specialty: "",
        teachingMode: "",
        experience: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create trainer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-trainer" onSubmit={handleSubmit}>
      <h2>Create Trainer Profile</h2>
      <input type="text" name="firstName" placeholder="First Name" value={trainerData.firstName} onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" value={trainerData.lastName} onChange={handleChange} required />
      <input type="file" name="profileImage" accept="image/*" onChange={(e) => setTrainerData({ ...trainerData, profileImage: e.target.files[0] })} />
      <input type="email" name="email" placeholder="Email" value={trainerData.email} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" value={trainerData.phone} onChange={handleChange} required />
      <input type="text" name="address1" placeholder="Address 1" value={trainerData.address1} onChange={handleChange} required />
      <input type="text" name="address2" placeholder="Address 2" value={trainerData.address2} onChange={handleChange} />
      <input type="text" name="city" placeholder="City" value={trainerData.city} onChange={handleChange} required />
      <input type="text" name="province" placeholder="Province" value={trainerData.province} onChange={handleChange} required />
      <input type="text" name="postal" placeholder="Postal Code" value={trainerData.postal} onChange={handleChange} required />
      <input type="text" name="country" placeholder="Country" value={trainerData.country} onChange={handleChange} required />
      <select name="gender" value={trainerData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Non-Binary">Non-Binary</option>
        <option value="Other">Other</option>
      </select>
      <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={trainerData.dateOfBirth} onChange={handleChange} required />
      <input type="number" name="height" placeholder="Height (cm)" value={trainerData.height} onChange={handleChange} required />
      <input type="number" name="weight" placeholder="Weight (kg)" value={trainerData.weight} onChange={handleChange} required />
      <input type="text" name="condition" placeholder="Medical Condition (if any)" value={trainerData.condition} onChange={handleChange} />
      <input type="text" name="allergy" placeholder="Allergies (if any)" value={trainerData.allergy} onChange={handleChange} />
      <input type="text" name="specialty" placeholder="Specialty (comma-separated)" value={trainerData.specialty} onChange={handleChange} required />
      <input type="text" name="teachingMode" placeholder="Teaching Mode (comma-separated)" value={trainerData.teachingMode} onChange={handleChange} required />
      <input type="number" name="experience" placeholder="Years of Experience" value={trainerData.experience} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Trainer"}</button>
      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default CreateTrainer;
