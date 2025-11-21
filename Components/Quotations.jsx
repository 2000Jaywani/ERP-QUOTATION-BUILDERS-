import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Quotations.css";

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [quotationsName, setQuotationsName] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch Quotations
  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/quotations/allGetQuotations"
      );
      setQuotations(response.data);
    } catch (error) {
      toast.error("❌ Failed to fetch quotations");
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ✅ Add Quotation
  const handleQuotationSubmit = async (e) => {
    e.preventDefault();

    if (!quotationsName.trim()) return toast.warn("⚠️ Enter quotation name");
    if (!createdOn) return toast.warn("⚠️ Enter created on date");
    if (!expiryDate) return toast.warn("⚠️ Enter expiry date");
    if (!status) return toast.warn("⚠️ Select status");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/quotations/addQuotations",
        null,
        {
          params: { quotationsName, createdOn, expiryDate, status },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Quotation added successfully");
        setQuotationsName("");
        setCreatedOn("");
        setExpiryDate("");
        setStatus("Draft");
        fetchQuotations();
      }
    } catch (error) {
      toast.error("❌ Error adding quotation");
    }
  };

  // ✅ Delete Quotation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?"))
      return;
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/quotations/deleteQuotations/${id}`
      );
      if (response.status === 200) {
        toast.success("✅ Quotation deleted successfully");
        fetchQuotations();
      }
    } catch (error) {
      toast.error("❌ Failed to delete quotation");
    }
  };

  // ✅ Open Edit Modal
  const handleEditClick = (q) => {
    setEditUser({ ...q });
  };

  // ✅ Update Quotation
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editUser.quotationsName.trim())
      return toast.warn("⚠️ Enter quotation name");
    if (!editUser.createdOn) return toast.warn("⚠️ Enter created on date");
    if (!editUser.expiryDate) return toast.warn("⚠️ Enter expiry date");
    if (!editUser.status) return toast.warn("⚠️ Select status");

    const quotationId = editUser.id || editUser.quotationId;
    if (!quotationId) {
      toast.error("❌ Quotation ID missing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/quotations/updateQuotations/${quotationId}`,
        null,
        {
          params: {
            quotationsName: editUser.quotationsName,
            createdOn: editUser.createdOn,
            expiryDate: editUser.expiryDate,
            status: editUser.status,
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Quotation updated successfully");
        setEditUser(null);
        fetchQuotations();
      }
    } catch (error) {
      toast.error("❌ Failed to update quotation");
    }
  };

  // ✅ Filter Quotations
  const filteredQuotations = quotations.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.quotationsName?.toLowerCase().includes(term) ||
      q.createdOn?.toLowerCase().includes(term) ||
      q.expiryDate?.toLowerCase().includes(term) ||
      (q.id?.toString() || q.quotationId?.toString()).includes(term)
    );
  });

  // ✅ Highlight search term
  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text?.toString().replace(
      regex,
      "<mark class='highlight'>$1</mark>"
    );
  };

  return (
    <div className="quotation-page">
      <h1 className="page-title">📜 Quotations Master</h1>

      <div className="quotation-container">
        {/* === Add Quotation Form === */}
        <div className="form-section">
          <h3>➕ Add Quotation</h3>
          <form onSubmit={handleQuotationSubmit} className="quotation-form">
            <div className="form-row">
              <label>Quotation Name</label>
              <input
                type="text"
                value={quotationsName}
                onChange={(e) => setQuotationsName(e.target.value)}
                placeholder="Enter quotation name"
              />
            </div>

            <div className="form-row">
              <label>Created On</label>
              <input
                type="date"
                value={createdOn}
                onChange={(e) => setCreatedOn(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Send">Send</option>
                <option value="Approved">Approved</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                💾 Save Quotation
              </button>
            </div>
          </form>
        </div>

        {/* === Table Section === */}
        <div className="table-section">
          <div className="table-header">
            <h3>📋 Quotations List</h3>
            <input
              type="text"
              placeholder="🔍 Search by ID, Name, or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Quotation Name</th>
                <th>Created On</th>
                <th>Expiry Date</th>
                <th> Status</th>
                <th>EDIT</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((q) => (
                  <tr key={q.id || q.quotationId}>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(q.id || q.quotationId),
                      }}
                    />
                    <td
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(q.quotationsName),
                      }}
                    />
                    <td
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(q.createdOn),
                      }}
                    />
                    <td
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(q.expiryDate),
                      }}
                    />
                    <td>
                      <b>{q.status}</b>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(q)}
                      >
                        ✏️ Edit
                      </button>
                      </td>
                      <td>  
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(q.id || q.quotationId)
                        }
                      >
                        🗑️ Delete 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Edit Modal === */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>✏️ Edit Quotation</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-row">
                <label>Quotation Name</label>
                <input
                  type="text"
                  value={editUser.quotationsName}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      quotationsName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-row">
                <label>Created On</label>
                <input
                  type="date"
                  value={editUser.createdOn}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      createdOn: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-row">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={editUser.expiryDate}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-row">
                <label>Status</label>
                <select
                  value={editUser.status}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Send">Send</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  💾 Save
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setEditUser(null)}
                >
                  ❌ Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Quotations;
