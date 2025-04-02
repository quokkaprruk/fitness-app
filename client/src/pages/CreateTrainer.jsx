import { useState } from "react";
import "../styles/AdminForm.css";

const CreateTrainer = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    dob: "",
    phone: "",
    specialties: [],
    teachingMode: "both",
    experience: "",
    username: "",
    email: "",
    password: ""
  });

  const specialtiesOptions = ["Yoga", "Pilates", "Zumba", "CrossFit", "Boxing"];
  const teachingModes = ["online", "onsite", "both"];

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Trainer profile created (mock)");
    console.log("Trainer Data:", formData);
  };

  return (
    <div className="admin-form-container">
      <h2>Create New Trainer</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info Fields (similar to Admin) */}

        <div className="form-group">
          <label>Gender</label>
          <select 
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Specialties</label>
          <div className="checkbox-group">
            {specialtiesOptions.map(specialty => (
              <label key={specialty}>
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Teaching Mode</label>
          <select
            value={formData.teachingMode}
            onChange={(e) => setFormData({...formData, teachingMode: e.target.value})}
          >
            {teachingModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Create Trainer</button>
      </form>
    </div>
  );
};

export default CreateTrainer;