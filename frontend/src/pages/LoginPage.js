import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("authToken", token);
        navigate("/hobbies");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
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
      <button onClick={handleLogin} style={{ margin: "10px", padding: "10px 20px" }}>
        Login
      </button>
      <br />
      <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", marginTop: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default LoginPage;
