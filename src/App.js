import React, { useEffect, useState } from "react";
import { Dropzone } from "./Dropzone";
import { Header } from "./Header";
import { ImageLoader } from "./ImageLoader";
import { Centroids } from "./Centroids";

const App = () => {
  // Buffer for current image
  const [buffer, setBuffer] = useState(null);
  // Centroid data
  const [centroids, setCentroids] = useState([]);
  // If drop zone is open
  const [drop, setDrop] = useState(false);
  const initBuffer = () => {
    // Load sample image from "/public/sample.webp"
    fetch(process.env.PUBLIC_URL + "/sample.webp")
      .then((res) => res.arrayBuffer())
      .then((buffer) => setBuffer(buffer));
  };
  useEffect(() => {
    initBuffer();
  }, []);
  return (
    <>
      <Header />
      <main>
        {buffer && <ImageLoader buffer={buffer} setCentroids={setCentroids} />}
        <div id={"left-container"}>
          <h1 className={"background"} id={"heading"}>
            Save your time picking colors
          </h1>
          <a
            href={"#"}
            id={"upload-btn"}
            className={"primary btn"}
            onClick={() => setDrop(true)}
          >
            {/* Select image button, opens drop zone */}
            Select image
          </a>
          <Centroids centroids={centroids} />
        </div>
      </main>
      {drop && <Dropzone setBuffer={setBuffer} setDrop={setDrop} />}
    </>
  );
};

export default App;
