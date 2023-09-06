import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Topbar from "./components/topbar/Topbar";
import Register from "./components/registration/Registration";
const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:8000/"); 
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, []); // Empty dependency array ensures this effect runs once after initial render

  return (
    <div>
      <Topbar />
      {message}
      <Register />  
    </div>
  );
};

export default App;
