import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Unauthorized Access
      </h2>
      <p style={{ marginBottom: "1.5rem" }}>
        You do not have permission to view this page.
      </p>
      <Link to="/" style={{ textDecoration: "underline", fontSize: "0.9rem" }}>
        Return Home
      </Link>
    </div>
  );
};

export default Unauthorized;
