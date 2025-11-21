import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./User.css";

function User() {
  const [userFullName, setUserFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState("");
  const [userlist, setUserlist] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchUserList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/allUsers");
      if (response.status === 200) setUserlist(response.data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`http://localhost:8080/api/users/deleteUser/${userId}`);
      if (response.status === 200) {
        toast.success("✅ User deleted successfully");
        fetchUserList();
      }
    } catch (error) {
      toast.error("❌ Failed to delete user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userFullName.trim()) return toast.warn("⚠️ Please enter full name");
    if (!mobileNumber.trim()) return toast.warn("⚠️ Please enter mobile number");
    if (!/^[0-9]{10}$/.test(mobileNumber)) return toast.warn("⚠️ Mobile must be 10 digits");
    if (!role.trim()) return toast.warn("⚠️ Please select a role");

    const sendData = new FormData();
    sendData.append("userFullName", userFullName);
    sendData.append("mobileNumber", mobileNumber);
    sendData.append("role", role);

    try {
      const response = await axios.post("http://localhost:8080/api/users/addUsers", sendData);
      if (response.status === 200 || response.status === 201) {
        toast.success("✅ User added successfully");
        fetchUserList();
        setUserFullName("");
        setMobileNumber("");
        setRole("");
      }
    } catch (error) {
      toast.error("❌ System Error");
    }
  };

  //------------------------------
  const handleEditClick = (user) => setEditUser({ ...user });

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUser.userFullName.trim()) return toast.warn("⚠️ Please enter full name");
    if (!editUser.mobileNumber.trim()) return toast.warn("⚠️ Please enter mobile number");
    if (!/^[0-9]{10}$/.test(editUser.mobileNumber)) return toast.warn("⚠️ Mobile must be 10 digits");
    if (!editUser.role.trim()) return toast.warn("⚠️ Please select a role");

    const formData = new FormData();
    formData.append("userFullName", editUser.userFullName);
    formData.append("mobileNumber", editUser.mobileNumber);
    formData.append("role", editUser.role);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/updateUserData/${editUser.userId}`,
        formData
      );
      if (response.status === 200) {
        toast.success("✅ User updated successfully!");
        setEditUser(null);
        fetchUserList();
      }
    } catch (error) {
      toast.error("❌ Failed to update user");
    }
  };

  const highlightText = (text) => {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText})`, "gi");
    return text.toString().replace(regex, "<span class='highlight'>$1</span>");
  };

  const filteredUsers = userlist.filter(
    (user) =>
      user.userId.toString().includes(searchText) ||
      user.userFullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.mobileNumber.includes(searchText) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="user-container">
      {/* Left Form Section */}
      <div className="user-form">
        <h2 className="form-title">Add User Master</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={userFullName}
              onChange={(e) => setUserFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add User</button>
          </div>
        </form>
      </div>

      {/* Right Table Section */}
      <div className="user-table">
        <h2 className="table-title">User List</h2>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by ID, Name, Mobile, Role..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Mobile Number</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td dangerouslySetInnerHTML={{ __html: highlightText(user.userId || user.id) }} />
                  <td dangerouslySetInnerHTML={{ __html: highlightText(user.userFullName) }} />
                  {/* <td dangerouslySetInnerHTML={{ __html: highlightText(user.mobileNumber) }} /> */}
                  <td dangerouslySetInnerHTML={{ __html: highlightText(`<b>+91</b> ${user.mobileNumber}`)  }}/>

                  <td dangerouslySetInnerHTML={{ __html: highlightText(user.role) }} />
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(user)}>
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user.userId || user.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editUser.userFullName}
                  onChange={(e) => setEditUser({ ...editUser, userFullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={editUser.mobileNumber}
                  onChange={(e) => setEditUser({ ...editUser, mobileNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="">-- Select Role --</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">💾 Save</button>
                <button type="button" className="btn-close" onClick={() => setEditUser(null)}>❌ Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
