import { useState, useEffect } from "react";
import axios from "axios";
// Add these imports at the top of your index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Home from "./Pages/Home.jsx";
// import "./App.css";

function App() {
  //   const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/");
  //       setData(response.data);
  //       setError(null);
  //     } catch (err) {
  //       setError(err.message);
  //       setData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Home />
      {/* <div>
        <h2>Data from Backend:</h2>
        <h2>{data.message}</h2>
      </div> */}

    </>
  );
}

export default App;
