import React, { useState } from "react";

const Centroid = ({ centroid }) => {
  const colorCode = centroid.stringify();
  const [displayText, setDisplayText] = useState(colorCode);
  return (
    <div
      className={"centroid-block"}
      style={{ backgroundColor: centroid.stringify() }}
      onClick={async (e) => {
        try {
          await navigator.clipboard.writeText(colorCode);
          setDisplayText("Copied!");
          setTimeout(() => {
            setDisplayText(colorCode);
          }, 1000);
        } catch (err) {
          console.error("Failed to copy text");
        } finally {
          e.target.blur();
        }
      }}
      tabIndex={0}
    >
      <div className={"centroid-block-title"}>{displayText}</div>
    </div>
  );
};

export const Centroids = ({ centroids }) => {
  return (
    <div id={"centroid-container"}>
      {centroids.map((centroid, i) => (
        <Centroid key={i} centroid={centroid} />
      ))}
    </div>
  );
};
