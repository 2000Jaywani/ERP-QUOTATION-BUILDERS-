import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";
import User from "./User";
import Sections from "./Sections";
import Contents from "./Contents";
import Quotations from "./Quotations";
import Catalogs from "./Catalogs";
import Items from "./Items";
import RawMaterials from "./RawMaterials";

function Home() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Default Home Page */}
        <Route
          path="/"
          element={
            <div className="home-container">
              <div className="welcome-card">
                <h1>
                  Welcome to <span>ERP Masters</span>
                </h1>
                <p>Manage your operations efficiently with the navigation bar:</p>
                <div className="features">
                  <div className="feature">
                    <span className="feature-icon">📦</span>
                    <span className="feature-text">Items</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🔧</span>
                    <span className="feature-text">Raw Materials</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📝</span>
                    <span className="feature-text">Quotations</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* User Page */}
        <Route path="Users" element={<User />} />
        <Route path="Sections" element={<Sections />} />    
        <Route path="Contents" element={<Contents />} />
        <Route path="Quotations" element={<Quotations />} />
        <Route path="Catalogs" element={<Catalogs />} />
        <Route path="Items" element={<Items /> }/>
        <Route path="RawMaterials" element={<RawMaterials/>} />
      </Routes>
    </>
  );
}

export default Home;
































// import React,{useState,useEffect} from 'react';

// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import axios from "axios";
// import Navbar from  "./Navbar";
// import "./Home.css";
// import User from './User';


// function Home() {
//   return (

//     <>

//     <Navbar />


//       <Routes>
//          <Route path="Users" element={<User />} />
//       </Routes>

// <div className="home-container">
//   <div className="welcome-card">
//     <h1>Welcome to <span>ERP Masters</span></h1>
//     <p>Manage your operations efficiently with the navigation bar:</p>
//     <div className="features">
//       <div className="feature">
//         <span className="feature-icon">📦</span>
//         <span className="feature-text">Items</span>
//       </div>
//       <div className="feature">
//         <span className="feature-icon">🔧</span>
//         <span className="feature-text">Raw Materials</span>
//       </div>
//       <div className="feature">
//         <span className="feature-icon">📝</span>
//         <span className="feature-text">Quotations</span>
//       </div>
//     </div>
//   </div>
// </div>  





//     </>
//   )
// }

// export default Home