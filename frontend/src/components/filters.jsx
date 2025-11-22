import React, { useState } from "react";

export default function Filter() {
  const [duration, setDuration] = useState(1);
  const [field, setField] = useState("Internship");

  const submitForm = () => {
    alert(Mock Interview Set! Duration: ${duration} mins, Field: ${field});
  };

  return (
    <div
      style={{
        margin: 0,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f3f3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        className="card"
        style={{
          background: "white",
          width: "350px",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          className="title"
          style={{
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          Mock Interview Setup
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>Select Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginTop: "5px",
              marginBottom: "20px",
            }}
          >
            <option value="1">1 Minute</option>
            <option value="2">2 Minutes</option>
            <option value="3">3 Minutes</option>
            <option value="4">4 Minutes</option>
            <option value="5">5 Minutes</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>Interview Field</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginTop: "5px",
              marginBottom: "20px",
            }}
          >
            <option>Internship</option>
            <option>College Interview</option>
            <option>Technical Round</option>
            <option>HR Round</option>
            
          </select>
        </div>

        <button
          onClick={submitForm}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#011932",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Start Mock Interview
        </button>
      </div>
    </div>
  );
}