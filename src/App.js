import React, { useState } from "react";
// import Video from "./Video";
import "./App.css";
import BrushChart from "./BrushChart";

function App() {
  const [data, setData] = useState([10, 25, 30, 40, 25, 60]);
  const onAddDataClick = () =>
    setData([...data, Math.round(Math.random() * 100)]);

  return (
    <React.Fragment>
      <h2>Sub-selections with d3-brush</h2>

      <BrushChart data={data} />
      <button onClick={onAddDataClick}>Add data</button>

      {/* <Video /> */}
    </React.Fragment>
  );
}

export default App;
