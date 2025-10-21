import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    service_type: "",
    serial_number: "",
    price: "",
    supporter: "",
    has_bonus: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add client");

      setMessage("✅ Client added successfully!");
      setTimeout(() => navigate("/smart"), 1200);
    } catch (err) {
      console.error("Error adding client:", err);
      setMessage("❌ Failed to save client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStarlink = formData.service_type.toLowerCase().includes("starlink");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Add New Client</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Service Type</label>
          <select
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Service Type --</option>
            <option value="4G">4G</option>
            <option value="Starlink Standard">Starlink Standard</option>
            <option value="Starlink Mini">Starlink Mini</option>
          </select>
        </div>

        {isStarlink && (
          <div style={styles.formGroup}>
            <label>Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label>Price (RWF)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Supporter</label>
          <input
            type="text"
            name="supporter"
            value={formData.supporter}
            onChange={handleChange}
          />
        </div>

        <div style={{ ...styles.formGroup, flexDirection: "row", alignItems: "center" }}>
          <input
            type="checkbox"
            name="has_bonus"
            checked={formData.has_bonus}
            onChange={handleChange}
          />
          <label style={{ marginLeft: "8px" }}>Has Bonus</label>
        </div>

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Client"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  submitBtn: {
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "500",
    color: "#333",
  },
};

export default Create;





