import React, { useState } from "react";
import "./styles/ContactPage.css";
import Navbar from "../components/Navbar.jsx";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const object = {
      ...formData,
      access_key: "d2afc434-8e5c-48c3-a787-bc35da8bfe3f",
    };
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        console.log("Success", res);
        alert("Message Sent Successfully!");
      }
    } catch (error) {
      console.error("Error sending form data", error);
      alert("There was an issue sending your message.");
    }
  };

  return (
    <div className="contact-container">
      <Navbar isLoggedIn={false} />
      <div className="contact-navbar-spacer"></div>
      <div className="contact-box">
        <h2>Get in Touch</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="phone">Phone (optional):</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <label htmlFor="message">Your Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="contact-info">
        <div className="info-section">
          <h2>Our Location</h2>
          <p>ISGA Gym, 123 Fitness St, Toronto, ON</p>
          <p>
            <strong>Phone:</strong> (123) 456-7890
          </p>
          <p>
            <strong>Email:</strong> support@isgagym.com
          </p>
          <p>
            <strong>Business Hours:</strong> Mon-Fri 6AM-10PM, Sat-Sun 8AM-8PM
          </p>
        </div>

        <div className="info-section">
          <h2>Follow Us</h2>
          <div>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/?lang=en&mx=2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
