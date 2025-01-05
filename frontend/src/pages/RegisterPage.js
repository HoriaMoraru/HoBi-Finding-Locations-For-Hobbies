import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(""); // Clear any previous error message

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert("Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Registration failed", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      <br />
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}
      <button onClick={handleRegister} style={{ margin: "10px", padding: "10px 20px" }}>
        Register
      </button>
      <br />
      <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", marginTop: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default RegisterPage;
