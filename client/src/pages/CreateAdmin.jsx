import { useState } from "react";
import "../styles/AdminForm.css";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Admin profile created (mock)");
    console.log("Admin Data:", formData);
    // In real app: Send to backend
  };

  return (
    <div className="admin-form-container">
      <h2>Create New Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input 
            type="text" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input 
            type="text" 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>

        {/* Add all other fields similarly */}
        <button type="submit" className="submit-btn">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;