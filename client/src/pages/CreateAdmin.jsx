import { useState } from "react";
import "./styles/CreateProfile.css"; 

const CreateAdmin = () => {
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Admin created successfully!");
    setAdminData({
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="admin-page">
      <h2>Create Admin</h2>
      <form onSubmit={handleSubmit} className="trainer-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={adminData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={adminData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          value={adminData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={adminData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={adminData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={adminData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={adminData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
