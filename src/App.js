import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import ml5 from "ml5";
import BarChart from "./BarChart";
import TachoChart from "./TachoChart";
import useInterval from "./useInterval";

let classifier;

function App() {
  const videoRef = useRef();
  const [data, setData] = useState([]);
  const [tachoData, setTachoData] = useState(0);
  const [classify, setClassify] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./my-model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && classify) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        setTachoData(results[0].confidence);
        setData([...data, results[0].confidence]);
      });
    }
  }, 1000);

  return (
    <React.Fragment>
      <h1>Hello ML5</h1>
      <TachoChart data={tachoData} />
      {/* <BarChart data={data} /> */}
      <button onClick={() => setClassify(!classify)}>
        {classify ? "Stop classifying" : "Start classifying"}
      </button>
      <video ref={videoRef} width="300" height="150" />
    </React.Fragment>
  );
}

export default App;
