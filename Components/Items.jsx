import React, { useState } from "react";
import "./Items.css";

function Items() {
  return (
    <div className="items_container">
      {/* ---------- FORM SECTION ---------- */}
      <div className="form_section">
        <h2>ADD / EDIT ITEM</h2>
        <form className="item_form">
          <label>Item Name</label>
          <input type="text" placeholder="Enter item name" />

          <label>Item Category</label>
          <input type="text" placeholder="Enter category" />

          <label>Sub-Category</label>
          <input type="text" placeholder="Enter sub-category" />

          <label>Supplier</label>
          <input type="text" placeholder="Enter supplier" />

          <label>Item Qty</label>
          <input type="number" placeholder="Enter quantity" />

          <label>Item Price</label>
          <input type="number" placeholder="Enter price" />

          <label>Item Code</label>
          <input type="text" placeholder="Enter code" />

          <label>Description</label>
          <textarea placeholder="Enter description"></textarea>

          <button type="submit" className="submit_btn">
            Save Item
          </button>
        </form>
      </div>

      {/* ---------- TABLE SECTION ---------- */}
      <div className="table_section">
        <h2>ITEM LIST</h2>
        <div className="table_scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>CATEGORY</th>
                <th>SUB-CATEGORY</th>
                <th>SUPPLIER</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>CODE</th>
                <th>EDIT</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Data */}
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Item {index + 1}</td>
                  <td>Electronics</td>
                  <td>Mobile</td>
                  <td>ABC Supplier</td>
                  <td>10</td>
                  <td>5000</td>
                  <td>ITM00{index + 1}</td>
                  <td><button className="edit_btn">Edit</button></td>
                  <td><button className="delete_btn">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Items;
