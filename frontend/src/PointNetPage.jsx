import React, { useState } from "react";
import Plot from "react-plotly.js";

const PointNetPage = () => {
  const [points, setPoints] = useState([]);
  const [prediction, setPrediction] = useState("");

  // Handle file upload and send to backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const pts = text
      .trim()
      .split("\n")
      .map((line) => line.trim().split(/\s+/).map(Number));
    setPoints(pts);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8080/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPrediction(data.predicted_label);
    } catch (err) {
      console.error("❌ Prediction error:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#111", color: "white" }}>
      {/* LEFT: Visualization */}
      <div style={{ flex: 2, padding: "20px" }}>
        <h2 style={{ textAlign: "center" }}>3D Point Cloud Visualization</h2>
        {points.length > 0 ? (
          <Plot
            data={[
              {
                x: points.map((p) => p[0]),
                y: points.map((p) => p[1]),
                z: points.map((p) => p[2]),
                mode: "markers",
                type: "scatter3d",
                marker: { size: 2, color: "skyblue" },
              },
            ]}
            layout={{
              autosize: true,
              paper_bgcolor: "#000",
              plot_bgcolor: "#000",
              scene: {
                xaxis: { color: "white" },
                yaxis: { color: "white" },
                zaxis: { color: "white" },
              },
              margin: { l: 0, r: 0, b: 0, t: 0 },
            }}
            style={{ width: "100%", height: "90%" }}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "30%" }}>
            Upload a .txt file to see visualization
          </p>
        )}
      </div>

      {/* RIGHT: Prediction Panel */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h2>Upload & Predict</h2>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            background: "#222",
            border: "1px solid #555",
            padding: "8px",
            color: "white",
            borderRadius: "4px",
          }}
        />
        <div>
          {prediction ? (
            <p style={{ fontSize: "18px" }}>
              ✅ Predicted Label:{" "}
              <span style={{ color: "skyblue", fontWeight: "bold" }}>
                {prediction}
              </span>
            </p>
          ) : (
            <p style={{ color: "#777" }}>No prediction yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointNetPage;