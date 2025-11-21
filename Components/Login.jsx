import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password!");
      return;
    }

    const sendData = new FormData();
    sendData.append("userName", username);
    sendData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/adminUser/loginAdminUser",
        sendData
      );

      if (response.status === 200) {
        toast.success("✅ Login Successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        const msg = error.response.data.message || "Login Failed!";
        toast.error(`❌ ${msg}`);
      } else {
        toast.error("❌ Login Failed! Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <div className="login-card">
        <h2 className="login-title">ERP ADMIN LOGIN</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="input-wrapper">
            <label>Username</label>
            <div className="input-box">
              <FaUserAlt className="input-icon" />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <label>Password</label>
            <div className="input-box">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="register-text">
            Don’t have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </div>
  );
}

export default Login;
