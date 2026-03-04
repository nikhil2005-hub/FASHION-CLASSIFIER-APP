import React, { useState, ChangeEvent } from "react";

type Prediction = {
  class: string;
  confidence: number;
};

const API_URL = "https://nikhilkorada2005-fashion-image-classifier.hf.space/predict";

export default function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPredictions(data.predictions);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Fashion Product Classifier</h1>

        <input type="file" accept="image/*" onChange={handleUpload} />

        {imagePreview && (
          <img src={imagePreview} alt="preview" style={styles.image} />
        )}

        {loading && <p>Analyzing...</p>}

        {predictions.length > 0 && (
          <div style={styles.results}>
            {predictions.map((p, index) => (
              <div key={index} style={styles.resultItem}>
                <strong>{p.class}</strong>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${(p.confidence * 100).toFixed(2)}%`,
                    }}
                  />
                </div>

                <span>{(p.confidence * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "400px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  image: {
    marginTop: "20px",
    width: "250px",
    borderRadius: "15px",
  },
  results: {
    marginTop: "25px",
    textAlign: "left",
  },
  resultItem: {
    marginBottom: "15px",
  },
  progressBar: {
    height: "10px",
    background: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "5px",
    marginBottom: "5px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    transition: "width 0.5s ease-in-out",
  },
};