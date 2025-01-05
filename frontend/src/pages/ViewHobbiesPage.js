import React, { useEffect, useState } from "react";

const ViewHobbiesPage = () => {
  const [hobbies, setHobbies] = useState([]);

  const fetchHobbies = async () => {
    try {
      const userId = "USER_ID"; // Replace this with a dynamic value from the login token
      const response = await fetch(
        `http://localhost:8080/api/hobbies?userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setHobbies(data.hobbies || []);
      } else {
        alert("Failed to fetch hobbies");
      }
    } catch (err) {
      console.error("Error fetching hobbies", err);
    }
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Your Hobbies</h1>
      {hobbies.length > 0 ? (
        <ul>
          {hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      ) : (
        <p>No hobbies found.</p>
      )}
    </div>
  );
};

export default ViewHobbiesPage;
