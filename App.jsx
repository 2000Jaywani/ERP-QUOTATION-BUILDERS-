import { useState } from 'react'
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; 
import Registration from "./Components/Registration";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";



function App() {
  return (
    <>
       <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/home/*" element={<Home />} />
          </Routes>
        </Router>      
    </>
  )
}

export default App
