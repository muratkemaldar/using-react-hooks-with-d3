import React, { useRef, useEffect } from "react";

/**
 * Just a component that I use for recording myself during video tutorials.
 */

const Video = () => {
  const videoRef = useRef();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
  }, []);
  return (
    <video
      ref={videoRef}
      style={{ transform: "scale(-1, 1)" }}
      width="300"
      height="150"
    />
  );
};

export default Video;
