import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sections.css";

function Sections() {
  const [sectionName, setSectionName] = useState("");
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------- ADD SECTION ----------------
  const handleSectionsSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName.trim()) {
      return toast.warn("⚠️ Please enter Section Name.", { theme: "dark" });
    }

    try {
      const form = new FormData();
      form.append("sectionName", sectionName);

      const response = await axios.post(
        "http://localhost:8080/api/sections/addSections",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Section added successfully", { theme: "dark" });
        setSectionName("");
        fetchSectionsList();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ System Error while adding section", { theme: "dark" });
    }
  };

  // ---------------- FETCH SECTIONS ----------------
  const fetchSectionsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/sections/allSections"
      );
      if (response.status === 200) {
        setSectionsList(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch sections", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsList();
  }, []);

  // ---------------- DELETE SECTION ----------------
  const handleDeleteSections = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this Section?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/sections/deleteSection/${sectionId}`
      );
      if (response.status === 200) {
        toast.success("✅ Section deleted successfully", { theme: "dark" });
        fetchSectionsList();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete Section", { theme: "dark" });
    }
  };

  // ---------------- EDIT SECTION ----------------
  const handleEditSectionsNameClick = (section) => {
    setEditSection(section);
    setEditName(section.sectionName ?? section.name);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      return toast.warn("⚠️ Please enter new Section Name.", { theme: "dark" });
    }

    try {
      const formData = new FormData();
      formData.append("sectionName", editName);

      const response = await axios.put(
        `http://localhost:8080/api/sections/updateSection/${
          editSection.id ?? editSection.sectionId
        }`,
        formData
      );

      if (response.status === 200) {
        toast.success("✅ Section name updated successfully!", {
          theme: "dark",
        });
        setEditSection(null);
        fetchSectionsList();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update Section name", { theme: "dark" });
    }
  };

  // ---------------- SEARCH FILTER ----------------
  const filteredSections = sectionsList.filter((section) =>
    (section.sectionName ?? section.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="sections_container">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* ---------- Add Section ---------- */}
      <div className="sections_form">
        <h2>Section Master</h2>
        <form onSubmit={handleSectionsSubmit}>
          <label>Section Name</label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Enter section name"
          />
          <button type="submit">Add Section</button>
        </form>
      </div>

      {/* ---------- Sections Table ---------- */}
      <div className="sections_table">
        <div className="table_header">
        <h2 style={{ color: "#1e3a8a" }}>Sections Table</h2>
  <input
            type="text"
            placeholder="Search section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search_box"
          />
        </div>

        {loading ? (
          <p>Loading sections...</p>
        ) : filteredSections.length === 0 ? (
          <p>No sections found.</p>
        ) : (
          <div className="table_scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Section Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.map((section) => (
                  <tr key={section.id ?? section.sectionId}>
                    <td>{section.id ?? section.sectionId}</td>
                    <td>
                      <b>{highlightText(section.sectionName ?? section.name)}</b>
                    </td>
                    <td>
                      <button
                        className="edit_btn"
                        type="button"
                        onClick={() => handleEditSectionsNameClick(section)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete_btn"
                        type="button"
                        onClick={() =>
                          handleDeleteSections(section.id ?? section.sectionId)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Edit Modal ---------- */}
      {editSection && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h3>Edit Section Name</h3>
            <form onSubmit={handleUpdateSection}>
              <label>New Section Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter new section name"
              />
              <div className="modal_buttons">
                <button type="submit" className="save_btn">
                  Save
                </button>
                <button
                  type="button"
                  className="close_btn"
                  onClick={() => setEditSection(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sections;
