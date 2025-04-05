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
    <form className="create-admin" onSubmit={handleSubmit}>
      <h2>Create Admin Profile</h2>
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
        type="tel"
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        onChange={handleChange}
      />
      <button type="submit">Create Admin</button>
    </form>
  );
};

export default CreateAdmin;
