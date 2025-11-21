import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCircle,
  FaLock,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Registration.css";

function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, email, username, password } = formData;

    if (!fullName || !phone || !email || !username || !password) {
      toast.error("All fields are required!");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number!");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address!");
      return;
    }

    const sendData = new FormData();
    sendData.append("adminFullName", fullName);
    sendData.append("phoneNumber", phone);
    sendData.append("email", email);
    sendData.append("userName", username);
    sendData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/adminUser/addAdminUser",
        sendData
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("✅ Admin Registration Successful");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          username: "",
          password: "",
        });
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Registration Failed");
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="registration-card">
        <h2 className="title-gradient">CREATE ACCOUNT</h2>

        <form onSubmit={handleRegistrationSubmit}>
          <div className="input-group">
            <span className="icon-wrapper">
              <FaUser />
            </span>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon-wrapper">
              <FaPhoneAlt />
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon-wrapper">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon-wrapper">
              <FaUserCircle />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <span className="icon-wrapper">
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="glow-button">
            Register
          </button>

          <p className="text-small">
            Already have an account?{" "}
            <span onClick={() => navigate("/")} className="link-text">
              Login here
            </span>
          </p>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}

export default Registration;
