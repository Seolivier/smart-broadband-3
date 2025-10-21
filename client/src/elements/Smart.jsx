
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Smart = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  // ----------------------------
  // Fetch clients whenever page changes
  // ----------------------------
  useEffect(() => {
    // Simple fetch version (like your first snippet)
    fetch(`${API_URL}/api/clients?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
        setError("Unable to load client list. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Smart Broadband Clients</h1>

      <div style={styles.actions}>
        <Link to="/create" style={styles.addButton}>+ Add New Client</Link>
      </div>

      {loading ? (
        <p style={styles.message}>Loading clients...</p>
      ) : error ? (
        <p style={{ ...styles.message, color: "red" }}>{error}</p>
      ) : clients.length === 0 ? (
        <p style={styles.message}>No clients found.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Service Type</th>
                <th>Serial Number</th>
                <th>Price (RWF)</th>
                <th>Supporter</th>
                <th>Bonus</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.full_name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.location}</td>
                  <td>{client.service_type}</td>
                  <td>{client.serial_number || "-"}</td>
                  <td>{Number(client.price).toLocaleString()}</td>
                  <td>{client.supporter}</td>
                  <td>{client.has_bonus ? "✅" : "❌"}</td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                  <td style={styles.actionsCell}>
                    <Link to={`/read/${client.id}`} style={styles.readBtn}>View</Link>
                    <Link to={`/edit/${client.id}`} style={styles.editBtn}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>

            <span style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              style={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "95%",
    margin: "40px auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#003366",
    marginBottom: "25px",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
  },
  addButton: {
    backgroundColor: "#0066cc",
    color: "white",
    padding: "10px 18px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "0.2s",
  },
  message: {
    textAlign: "center",
    color: "#555",
    fontSize: "1rem",
    marginTop: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  actionsCell: {
    display: "flex",
    gap: "8px",
  },
  readBtn: {
    color: "#0055cc",
    textDecoration: "none",
    fontWeight: "bold",
  },
  editBtn: {
    color: "#009933",
    textDecoration: "none",
    fontWeight: "bold",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    gap: "12px",
  },
  pageButton: {
    padding: "8px 14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f8f8f8",
    cursor: "pointer",
  },
  pageInfo: {
    fontSize: "0.95rem",
    color: "#333",
  },
};

export default Smart;






























