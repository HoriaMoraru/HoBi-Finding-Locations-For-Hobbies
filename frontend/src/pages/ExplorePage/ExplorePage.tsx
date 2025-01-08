// src/pages/ExplorePage/ExplorePage.tsx

import React from "react";
import MapContainer from "./MapContainer";
import { ToastContainer} from "react-toastify";
import "./ExplorePage.css";

/**
 * The top-level ExplorePage component.
 * Renders the MapContainer and any additional layout or wrappers you want.
 */
const ExplorePage: React.FC = () => {
  return (
    <div style={{ position: "relative" }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <MapContainer />
    </div>
  );
};

export default ExplorePage;
