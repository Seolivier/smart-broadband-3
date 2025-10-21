import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Read = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clients/${id}`);
        if (!response.ok) throw new Error("Client not found");
        const data = await response.json();
        setClient(data);
      } catch (err) {
        console.error("Error fetching client:", err);
        setMessage("❌ Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, API_URL]);

  if (loading) {
    return <p style={styles.message}>Loading client data...</p>;
  }

  if (!client) {
    return <p style={styles.message}>{message || "Client not found"}</p>;
  }

  const isStarlink = client.service_type?.toLowerCase().includes("starlink");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📄 Client Details</h2>

      <div style={styles.detailGroup}>
        <strong>Full Name:</strong> <span>{client.full_name}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Email:</strong> <span>{client.email || "-"}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Phone:</strong> <span>{client.phone}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Location:</strong> <span>{client.location || "-"}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Service Type:</strong> <span>{client.service_type}</span>
      </div>
      {isStarlink && (
        <div style={styles.detailGroup}>
          <strong>Serial Number:</strong> <span>{client.serial_number || "-"}</span>
        </div>
      )}
      <div style={styles.detailGroup}>
        <strong>Price (RWF):</strong> <span>{client.price}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Supporter:</strong> <span>{client.supporter || "-"}</span>
      </div>
      <div style={styles.detailGroup}>
        <strong>Has Bonus:</strong> <span>{client.has_bonus ? "Yes" : "No"}</span>
      </div>

      <button style={styles.backBtn} onClick={() => navigate("/smart")}>
        🔙 Back to Client List
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#003366",
    marginBottom: "25px",
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  detailGroup: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "1rem",
  },
  backBtn: {
    marginTop: "20px",
    backgroundColor: "#0066cc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
  },
  message: {
    textAlign: "center",
    marginTop: "40px",
    fontWeight: "500",
    color: "#333",
  },
};

export default Read;











