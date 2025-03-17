import { useState } from "react";
import "../../styles/Admin.css";

const CreateAdmin = () => {
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    roleLevel: "Standard Admin",
    modules: { classes: false, community: false, payments: false, reports: false },
    status: "Active",
    notes: "",
    image: null,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleModuleChange = (e) => {
    const { name, checked } = e.target;
    setAdminData((prevState) => ({
      ...prevState,
      modules: { ...prevState.modules, [name]: checked },
    }));
  };

  const handleImageUpload = (e) => {
    setAdminData({ ...adminData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminData.username || !adminData.email || !adminData.password) {
      alert("Please fill all required fields.");
      return;
    }
    console.log("Admin Profile Created:", adminData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Create Admin Profile</h3>
      <input type="text" name="username" placeholder="Username" value={adminData.username} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={adminData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={adminData.password} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone Number" value={adminData.phone} onChange={handleChange} />
      
      <label>Role Level</label>
      <select name="roleLevel" value={adminData.roleLevel} onChange={handleChange}>
        <option>Super Admin</option>
        <option>Standard Admin</option>
        <option>Support</option>
      </select>

      <label>Access Modules</label>
      <div className="checkbox-group">
        {Object.keys(adminData.modules).map((mod) => (
          <label key={mod}>
            <input type="checkbox" name={mod} checked={adminData.modules[mod]} onChange={handleModuleChange} /> {mod}
          </label>
        ))}
      </div>

      <label>Status</label>
      <select name="status" value={adminData.status} onChange={handleChange}>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <textarea name="notes" placeholder="Notes (optional)" value={adminData.notes} onChange={handleChange}></textarea>
      
      <label>Profile Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <button type="submit">Create Admin</button>
      {formSubmitted && <p className="success-message">Admin profile created successfully!</p>}
    </form>
  );
};

export default CreateAdmin;
