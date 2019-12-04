import React, { useState } from "react";
import TreeChart from "./TreeChart";
import "./App.css";

function App() {
  const [start, setStart] = useState(false);
  const [data, setData] = useState({
    name: "A1",
    children: [
      {
        name: "B1",
        children: [
          {
            name: "C1",
            value: 100
          },
          {
            name: "C2",
            value: 300
          },
          {
            name: "C3",
            value: 200
          }
        ]
      },
      {
        name: "B2",
        value: 200
      }
    ]
  });

  return (
    <React.Fragment>
      <h1>Tree Chart</h1>
      <TreeChart data={data} />
      <button onClick={() => setData(data.children[0])}>Update data</button>
    </React.Fragment>
  );
}

export default App;
