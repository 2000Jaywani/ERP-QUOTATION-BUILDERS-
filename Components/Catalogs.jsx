import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Catalogs.css";

function Catalogs() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [catalogs, setCatalogs] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  // ✅ Fetch all catalogs
  const fetchCatalogs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/catalogs/GetAllCatalogs");
      setCatalogs(res.data);
    } catch (error) {
      toast.error("❌ Error fetching catalogs");
    }
  };

  // ✅ Add or Update Catalog
  const handleCatalogSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.warn("⚠️ Please enter a title");
    if (!description.trim()) return toast.warn("⚠️ Please enter a description");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:8080/api/catalogs/updateCatalog/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.status === 200) toast.success("✅ Catalog updated successfully!");
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/catalogs/addCatalogs",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.status === 200) toast.success("✅ Catalog added successfully!");
      }

      setTitle("");
      setFile(null);
      setDescription("");
      setEditId(null);
      fetchCatalogs();
    } catch (error) {
      toast.error("❌ Error saving catalog");
    }
  };

  // ✅ Edit Catalog
  const handleEdit = (cat) => {
    const idValue = cat.id || cat.catalogId || cat.catalogsId;
    setEditId(idValue);
    setTitle(cat.title);
    setDescription(cat.description);
  };

  // ✅ Delete Catalog
  const handleDelete = async (cat) => {
    const idValue = cat.id || cat.catalogId || cat.catalogsId;
    if (!idValue) {
      toast.error("❌ Catalog ID not found!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this catalog?")) return;

    try {
      const res = await axios.delete(`http://localhost:8080/api/catalogs/deleteCatalog/${idValue}`);
      if (res.status === 200) {
        toast.success("🗑️ Catalog deleted successfully!");
        fetchCatalogs();
      }
    } catch (error) {
      toast.error("❌ Error deleting catalog");
    }
  };

  // ✅ Download Catalog File (force download)
  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:8080/image/${fileName}`, {
        responseType: "blob", // binary data
      });

      // Create a download link manually
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // keep original filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("❌ Error downloading file");
    }
  };

  return (
    <>
      <div className="catalogs-page">
        <h1 className="page-title">Catalogs Master</h1>

        <div className="catalogs-container">
          {/* === Form Section === */}
          <div className="catalogs-form">
            <h2>{editId ? "Edit Catalog" : "Add Catalog"}</h2>

            <form onSubmit={handleCatalogSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter catalog title"
                />
              </div>

              <div className="form-group">
                <label>File</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="3"
                />
              </div>

              <button type="submit" className="submit-btn">
                {editId ? "Update Catalog" : "Add Catalog"}
              </button>
            </form>
          </div>

          {/* === Table Section === */}
          <div className="catalogs-table">
            <h2>Catalogs List</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>File</th>
                    <th>Description</th>
                    <th>Created On</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {catalogs.length > 0 ? (
                    catalogs.map((cat, index) => {
                      const idValue = cat.id || cat.catalogId || cat.catalogsId;
                      return (
                        <tr key={idValue || index}>
                          <td>{idValue}</td>
                          <td>{cat.title}</td>
                          <td>
                            {cat.fileName ? (
                              <button
                                className="download-btn"
                                onClick={() => handleDownload(cat.fileName)}
                              >
                                ⬇ Download
                              </button>
                            ) : (
                              "No file"
                            )}
                          </td>
                          <td>{cat.description}</td>
                          <td>{cat.createdOn}</td>
                          <td>
                            <button className="edit-btn" onClick={() => handleEdit(cat)}>
                              Edit
                            </button>
                          </td>
                          <td>
                            <button className="delete-btn" onClick={() => handleDelete(cat)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7">No catalogs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default Catalogs;
