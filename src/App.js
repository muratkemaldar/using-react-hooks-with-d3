import React, { useState } from "react";
// import Video from "./Video";
import "./App.css";
import BrushChart2 from "./BrushChart2";
import BrushChart2Child from "./BrushChart2Child";

function App() {
  const [data, setData] = useState(
    Array.from({ length: 30 }).map(() => Math.round(Math.random() * 100))
  );
  const onAddDataClick = () =>
    setData([...data, Math.round(Math.random() * 100)]);

  return (
    <React.Fragment>
      <h2>Sub-selections with d3-brush</h2>

      <BrushChart2 data={data}>
        {selection => <BrushChart2Child data={data} selection={selection} />}
      </BrushChart2>
      <button onClick={onAddDataClick}>Add data</button>

      {/* <Video /> */}
    </React.Fragment>
  );
}

export default App;
