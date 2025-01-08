// src/components/LeftPanel/MenuButton.tsx
import React from "react";
import "./MenuButton.css";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <button className="menu-button" onClick={onClick} aria-label="Toggle menu">
      <div className="menu-line" />
      <div className="menu-line" />
      <div className="menu-line" />
    </button>
  );
};

export default MenuButton;
