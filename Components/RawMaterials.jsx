import React from "react";
import "./RawMaterials.css";

function RawMaterials() {
  return (
    <div className="raw-material-container">
      <h1 className="page-title">Raw Material Master</h1>

      <div className="content-section">
        {/* ===== Left Column - Form ===== */}
        <div className="form-section">
          <h2 className="section-title">Add / Edit Raw Material</h2>

          <form className="material-form">
            <label>Raw Material Name</label>
            <input type="text" placeholder="Enter Raw Material Name" />

            <label>Quantity</label>
            <input type="text" placeholder="Enter Quantity" />

            <label>Price</label>
            <input type="text" placeholder="Enter Price" />

            <label>Price Code</label>
            <input type="text" placeholder="Enter Price Code" />

            <label>Linked Item</label>
            <input type="text" placeholder="Enter Linked Item" />

            <label>Supplier</label>
            <input type="text" placeholder="Enter Supplier Name" />

            <label>Add Quotations</label>
            <input type="text" placeholder="Add Quotation Details" />

            <label>Description</label>
            <textarea rows="3" placeholder="Enter Description"></textarea>

            <button type="submit" className="submit-btn">
              Save Material
            </button>
          </form>
        </div>

        {/* ===== Right Column - Table ===== */}
        <div className="table-section">
          <h2 className="section-title">Raw Material List</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Code</th>
                  <th>Linked Item</th>
                  <th>Supplier</th>
                  <th>Quotation</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Steel Rod</td>
                  <td>50</td>
                  <td>₹500</td>
                  <td>ST001</td>
                  <td>Item A</td>
                  <td>ABC Supplier</td>
                  <td>Yes</td>
                  <td>
                    <button className="edit-btn">✏️ Edit</button>
                  </td>
                  <td>
                    <button className="delete-btn">🗑️ Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Copper Wire</td>
                  <td>100</td>
                  <td>₹1200</td>
                  <td>CP002</td>
                  <td>Item B</td>
                  <td>XYZ Supplier</td>
                  <td>No</td>
                  <td>
                    <button className="edit-btn">✏️ Edit</button>
                  </td>
                  <td>
                    <button className="delete-btn">🗑️ Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RawMaterials;
