import React, { useState } from "react";
import "./App.css";
import PieChart from "./PieChart";

function App() {
  const [data, setData] = useState([
    {
      name: "apples",
      value: 100
    },
    {
      name: "bananas",
      value: 300
    },
    {
      name: "cherries",
      value: 250
    }
  ]);

  return (
    <React.Fragment>
      <h1>Pie Chart</h1>
      <PieChart data={data} />
      <button
        onClick={() => {
          setData([
            {
              name: "apples",
              value: Math.round(Math.random() * 100)
            },
            {
              name: "bananas",
              value: Math.round(Math.random() * 200)
            },
            {
              name: "cherries",
              value: Math.round(Math.random() * 300)
            }
          ]);
        }}
      >
        Randomize
      </button>
    </React.Fragment>
  );
}

export default App;
