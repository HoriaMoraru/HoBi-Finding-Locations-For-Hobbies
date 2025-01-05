import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to HoBi</h1>
      <p>Explore your hobbies and passions with like-minded people!</p>
      <div>
        <button
          onClick={() => navigate("/login")}
          style={{ margin: "10px", padding: "10px 20px" }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          style={{ margin: "10px", padding: "10px 20px" }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default MainPage;
