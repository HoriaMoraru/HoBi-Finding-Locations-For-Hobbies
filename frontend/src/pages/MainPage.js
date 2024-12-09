import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  return (
    <div style={{
      height: "100vh",
      backgroundImage: "url('/src/resources/main-page-man-woman-running-bg-photo.webp')",
      backgroundSize: "cover",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <button
        onClick={handleCreateAccount}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Create Account
      </button>
    </div>
  );
};

export default MainPage;
