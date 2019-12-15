import React from "react";
import TreeChart from "./TreeChart";
import ForceTreeChart from "./ForceTreeChart";
// import Video from "./Video";
import "./App.css";

const data = {
  name: "😐",
  children: [
    {
      name: "🙂",
      children: [
        {
          name: "😀"
        },
        {
          name: "😁"
        },
        {
          name: "🤣"
        }
      ]
    },
    {
      name: "😔"
    }
  ]
};

function App() {
  return (
    <React.Fragment>
      <h2>🪐 D3 Force Layout</h2>
      <ForceTreeChart data={data} />
      <h2>Animated Tree Chart</h2>
      <TreeChart data={data} />
      {/* <Video /> */}
    </React.Fragment>
  );
}

export default App;
