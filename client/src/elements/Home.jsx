import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #2563eb, #1e3a8a)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Smart Broadband Client Management
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Manage your Starlink clients easily and efficiently
      </p>
      <Link
        to="/smart"
        style={{
          background: "#fff",
          color: "#1e3a8a",
          padding: "12px 25px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go to Client Dashboard →
      </Link>
    </div>
  );
};

export default Home;

























