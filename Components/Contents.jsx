import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contents.css";

function Contents() {
  const [sectionsList, setSectionsList] = useState([]);
  const [contentsList, setContentsList] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [title, setTitle] = useState("");
  const [sequence, setSequence] = useState("");
  const [description, setDescription] = useState("");
  const [altTag, setAltTag] = useState("");
  const [link, setLink] = useState("");
  const [imageContents, setImageContents] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedId, setHighlightedId] = useState(null);

  // ---------------- Fetch Sections ----------------
  const fetchSectionsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/sections/allSections");
      if (response.status === 200) setSectionsList(response.data);
    } catch (error) {
      toast.error("❌ Failed to fetch sections", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch Contents ----------------
  const fetchContentsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/contents/allGetContents");
      if (response.status === 200) {
        setContentsList(response.data);
        setFilteredContents(response.data);
      }
    } catch (error) {
      toast.error("❌ Failed to fetch contents", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsList();
    fetchContentsList();
  }, []);

  // ✅ Highlight matched text in green
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight-green">$1</span>');
  };

  // ---------------- Search Filter ----------------
  useEffect(() => {
    const filtered = contentsList.filter((content) => {
      const id = content.contentsId || content.contentId || content.id || "";
      const sectionName = content.sections?.sectionName?.toLowerCase() || "";
      const titleLower = content.title?.toLowerCase() || "";
      const seq = content.sequence?.toString() || "";
      return (
        id.toString().includes(searchTerm.toLowerCase()) ||
        sectionName.includes(searchTerm.toLowerCase()) ||
        titleLower.includes(searchTerm.toLowerCase()) ||
        seq.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredContents(filtered);
  }, [searchTerm, contentsList]);

  // ---------------- Submit Form ----------------
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSectionId) return toast.warn("⚠️ Please select a section");
    if (!title.trim()) return toast.warn("⚠️ Please enter title");
    if (!sequence.trim()) return toast.warn("⚠️ Please enter sequence");
    if (!description.trim()) return toast.warn("⚠️ Please enter description");
    if (!altTag.trim()) return toast.warn("⚠️ Please enter alt tag");
    if (!link.trim()) return toast.warn("⚠️ Please enter link");
    if (!imageContents) return toast.warn("⚠️ Please upload image");

    const sendData = new FormData();
    sendData.append("sectionId", selectedSectionId);
    sendData.append("title", title);
    sendData.append("sequence", sequence);
    sendData.append("description", description);
    sendData.append("altTag", altTag);
    sendData.append("link", link);
    sendData.append("imageContents", imageContents);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/contents/addContents",
        sendData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Content added successfully");

        const newContentId = response.data?.contentsId || response.data?.id;
        setHighlightedId(newContentId);

        setSelectedSectionId("");
        setTitle("");
        setSequence("");
        setDescription("");
        setAltTag("");
        setLink("");
        setImageContents(null);
        document.getElementById("imageInput").value = "";

        fetchContentsList();

        setTimeout(() => setHighlightedId(null), 3000);
      }
    } catch (error) {
      toast.error("❌ System Error");
    }
  };

  // ---------------- Edit ----------------
  const handleEditContentsClick = (content) => {
    const id = content.contentsId || content.contentId || content.id || content._id;
    if (!id) return toast.error("❌ Cannot edit: contentsId missing");
    setEditUser({ ...content, contentsId: id });
  };

  // ---------------- Update ----------------
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUser.title?.trim()) return toast.warn("⚠️ Please enter title");
    if (!editUser.sequence?.toString().trim()) return toast.warn("⚠️ Please enter sequence");
    if (!editUser.altTag?.trim()) return toast.warn("⚠️ Please enter alt tag");

    const formData = new FormData();
    formData.append("title", editUser.title);
    formData.append("sequence", editUser.sequence);
    formData.append("description", editUser.description || "");
    formData.append("altTag", editUser.altTag);
    if (editUser.imageContents instanceof File) {
      formData.append("imageContents", editUser.imageContents);
    }

    try {
      const id = editUser.contentsId || editUser.contentId;
      if (!id) return toast.error("❌ Missing Content ID for update");

      const response = await axios.put(
        `http://localhost:8080/api/contents/updateContents/${id}`,
        formData
      );

      if (response.status === 200) {
        toast.success("✅ Contents Updated Successfully!");
        setEditUser(null);
        fetchContentsList();
      }
    } catch (error) {
      toast.error("❌ Failed to update content");
    }
  };

  // ---------------- Delete ----------------
  const handleDeleteContents = async (content) => {
    const id = content.contentsId || content.contentId || content.id || content._id;
    if (!id) return toast.error("❌ Invalid Content ID");

    if (!window.confirm("Are you sure you want to delete this content?")) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/contents/deleteContents/${id}`);
      if (response.status === 200) {
        toast.success("✅ Content deleted successfully");
        fetchContentsList();
      }
    } catch {
      toast.error("❌ Failed to delete content");
    }
  };

  return (
    <div className="contents_container">
      <ToastContainer position="top-center" />
      <div className="contents_main">
        {/* ---------------- Left Column ---------------- */}
        <div className="col-form">
          <form className="content-form" onSubmit={handleContentSubmit}>
            <h3>Add Content</h3>

            <label>
              Section
              <select
                className="form-control"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
              >
                <option value="">-- Select Section --</option>
                {sectionsList.map((section) => (
                  <option key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Title
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title" />
            </label>

            <label>
              Sequence
              <input type="text" value={sequence} onChange={(e) => setSequence(e.target.value)} placeholder="Enter Sequence" />
            </label>

            <label>
              Description
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
            </label>

            <label>
              Alt Tag
              <input type="text" value={altTag} onChange={(e) => setAltTag(e.target.value)} placeholder="Enter Alt Tag" />
            </label>

            <label>
              Link
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter Link URL" />
            </label>

            <label>
              Image
              <input id="imageInput" type="file" onChange={(e) => setImageContents(e.target.files[0])} />
            </label>

            <button type="submit" className="submit-btn">Save Content</button>
          </form>
        </div>

        {/* ---------------- Right Column ---------------- */}
        <div className="col-table">
          <h3>Content List</h3>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by ID, Section, Title, or Sequence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <p>Loading...</p>
          ) : filteredContents.length === 0 ? (
            <p>No contents found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Section</th>
                  <th>Title</th>
                  <th>Sequence</th>
                  <th>Image</th>
                  <th>Alt Tag</th>
                  <th>Created Date</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.map((content, index) => {
                  const id = content.contentsId || content.contentId || content.id || index + 1;
                  return (
                    <tr key={id} className={highlightedId === id ? "highlight-row" : ""}>
                      <td dangerouslySetInnerHTML={{ __html: highlightText(id.toString(), searchTerm) }}></td>
                      <td dangerouslySetInnerHTML={{ __html: highlightText(content.sections?.sectionName || "N/A", searchTerm) }}></td>
                      <td dangerouslySetInnerHTML={{ __html: highlightText(content.title || "N/A", searchTerm) }}></td>
                      <td dangerouslySetInnerHTML={{ __html: highlightText(content.sequence?.toString() || "N/A", searchTerm) }}></td>
                      <td className="image-cell">
                        <img
                          src={`http://localhost:8080/image/${content.imageContents}`}
                          alt={content.altTag || "content_image"}
                          className="content-image"
                        />
                      </td>
                      <td>{content.altTag || "N/A"}</td>
                      <td>{content.createdOn ? new Date(content.createdOn).toLocaleDateString() : "N/A"}</td>
                      <td><button className="edit-btn" onClick={() => handleEditContentsClick(content)}>Edit</button></td>
                      <td><button className="delete-btn" onClick={() => handleDeleteContents(content)}>Delete</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ---------------- Modal ---------------- */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Edit Content</h3>
            <form onSubmit={handleUpdateUser} className="modal-form">
              <label>
                Title
                <input type="text" value={editUser.title} onChange={(e) => setEditUser({ ...editUser, title: e.target.value })} />
              </label>
              <label>
                Sequence
                <input type="text" value={editUser.sequence} onChange={(e) => setEditUser({ ...editUser, sequence: e.target.value })} />
              </label>
              <label>
                Alt Tag
                <input type="text" value={editUser.altTag} onChange={(e) => setEditUser({ ...editUser, altTag: e.target.value })} />
              </label>
              <label>
                Image
                <input type="file" onChange={(e) => setEditUser({ ...editUser, imageContents: e.target.files[0] })} />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="close-btn" onClick={() => setEditUser(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contents;
