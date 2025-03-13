import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        404 - Page Not Found
      </h2>
      <p style={{ marginBottom: "1.5rem" }}>
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link to="/" style={{ textDecoration: "underline", fontSize: "0.9rem" }}>
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
