import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Smart = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/clients?page=${currentPage}`);
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Unable to load client list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`${API_URL}/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
      fetchClients(); // Refresh table
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Failed to delete client.");
    }
  };

  useEffect(() => {
    fetchClients();
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
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "50px" }}>ID</th>
                  <th style={{ ...styles.th, width: "160px" }}>Full Name</th>
                  <th style={{ ...styles.th, width: "180px" }}>Email</th>
                  <th style={{ ...styles.th, width: "120px" }}>Phone</th>
                  <th style={{ ...styles.th, width: "140px" }}>Location</th>
                  <th style={{ ...styles.th, width: "120px" }}>Service Type</th>
                  <th style={{ ...styles.th, width: "120px" }}>Serial</th>
                  <th style={{ ...styles.th, width: "100px" }}>Price</th>
                  <th style={{ ...styles.th, width: "120px" }}>Supporter</th>
                  <th style={{ ...styles.th, width: "70px" }}>Bonus</th>
                  <th style={{ ...styles.th, width: "120px" }}>Created</th>
                  <th style={{ ...styles.th, width: "180px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{
                      ...styles.row,
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
                    }}
                  >
                    <td style={styles.td}>{c.id}</td>
                    <td style={styles.td}>{c.full_name}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.phone}</td>
                    <td style={styles.td}>{c.location}</td>
                    <td style={styles.td}>{c.service_type}</td>
                    <td style={styles.td}>{c.serial_number || "-"}</td>
                    <td style={styles.td}>{Number(c.price).toLocaleString()}</td>
                    <td style={styles.td}>{c.supporter}</td>
                    <td style={styles.td}>{c.has_bonus ? "✅" : "❌"}</td>
                    <td style={styles.td}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td style={styles.actionsCell}>
                      <Link to={`/read/${c.id}`} style={styles.readBtn}>View</Link>
                      <Link to={`/edit/${c.id}`} style={styles.editBtn}>Edit</Link>
                      <button onClick={() => deleteClient(c.id)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
    margin: "30px auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#003366",
    marginBottom: "20px",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  actions: { display: "flex", justifyContent: "flex-end", marginBottom: "15px" },
  addButton: {
    backgroundColor: "#0066cc",
    color: "white",
    padding: "8px 14px",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "0.9rem",
    transition: "0.3s",
  },
  message: { textAlign: "center", color: "#555", fontSize: "0.9rem", marginTop: "20px" },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
    fontSize: "0.85rem",
  },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    fontWeight: "600",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#f0f4f8",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #eee",
  },
  row: {
    transition: "background-color 0.2s",
    cursor: "default",
  },
  actionsCell: { display: "flex", gap: "6px" },
  readBtn: { color: "#0055cc", textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" },
  editBtn: { color: "#009933", textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" },
  deleteBtn: {
    color: "#cc0000",
    backgroundColor: "#ffeaea",
    border: "1px solid #cc0000",
    borderRadius: "5px",
    padding: "4px 8px",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "18px",
    gap: "10px",
  },
  pageButton: {
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f4f4f4",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  pageInfo: { fontSize: "0.85rem", color: "#333" },
};

export default Smart;






























