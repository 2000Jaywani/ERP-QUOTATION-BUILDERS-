import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    toast.info(
      <div>
        Are you sure you want to logout?
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            style={{
              padding: "5px 10px",
              border: "none",
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button
            style={{
              padding: "5px 10px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => handleNavClick("/home")}>
        XEEPL ERP
      </div>

      <div
        className={`navbar-toggle ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
        <button
          className={location.pathname === "/home" ? "active" : ""}
          onClick={() => handleNavClick("/home")}
        >
          Home
        </button>
       


        <button  className={location.pathname === "/home/Users" ? "active" : ""} 
                  onClick={() => handleNavClick("/home/Users")} >
            Users                                                                 
        </button>
       
       

        <button
          className={location.pathname === "/home/Sections" ? "active" : ""}
          onClick={() => handleNavClick("/home/Sections")}
        >
          Sections
        </button>



        
        <button
          className={location.pathname === "/home/Contents" ? "active" : ""}
          onClick={() => handleNavClick("/home/Contents")}
        >
          Contents
        </button>
        <button
          className={location.pathname === "/home/Items" ? "active" : ""}
          onClick={() => handleNavClick("/home/Items")}
        >
          Items
        </button>
        <button
          className={location.pathname === "/home/RawMaterials" ? "active" : ""}
          onClick={() => handleNavClick("/home/RawMaterials")}
        >
          Raw Materials
        </button>



        <button
          className={location.pathname === "/home/Catalogs" ? "active" : ""}
          onClick={() => handleNavClick("/home/Catalogs")}
        >
          Catalogs
        </button>



        <button
          className={location.pathname === "/home/Quotations" ? "active" : ""}
          onClick={() => handleNavClick("/home/Quotations")}
        >
          Quotations
        </button>
        <button
          className={location.pathname === "/home/MakeQuotations" ? "active" : ""}
          onClick={() => handleNavClick("/home/MakeQuotations")}
        >
          Make Quotations
        </button>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <ToastContainer />
    </nav>
  );
}

export default Navbar;
