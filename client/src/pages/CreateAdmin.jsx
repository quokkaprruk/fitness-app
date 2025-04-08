import { useState } from "react";
import "./styles/CreateProfile.css";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...adminData,
      role: "admin",
      dateOfBirth: adminData.dob,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/signup`,
        payload
      );

      if (response.status === 201) {
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
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "An error occurred while creating the admin.";
      alert(errorMsg);
      console.error("Create admin error:", error);
    }
  };

  return (
    <div className="admin-page">
      <div className="CA-nav-spacer"></div>
      <h2>Create Admin</h2>
      <form onSubmit={handleSubmit} className="trainer-form">
        <input
          className="create-trainer-firstName-text"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={adminData.firstName}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-firstName-text"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={adminData.lastName}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-date-input"
          type="date"
          name="dob"
          value={adminData.dob}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-phone-input"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={adminData.phone}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-username-input"
          type="text"
          name="username"
          placeholder="Username"
          value={adminData.username}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-email-input"
          type="email"
          name="email"
          placeholder="Email"
          value={adminData.email}
          onChange={handleChange}
          required
        />
        <input
          className="create-trainer-pwd-input"
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
