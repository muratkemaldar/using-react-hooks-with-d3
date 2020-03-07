import React from "react";
import "./App.css";
import BarChartNegativeValues from "./BarChartNegativeValues";

function App() {
  const data = [10, 30, -40, 50, -20, 70];

  return (
    <React.Fragment>
      <h2>Bar Chart: Negative Values </h2>
      <BarChartNegativeValues data={data} />
    </React.Fragment>
  );
}

export default App;
