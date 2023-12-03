import React, { useState } from "react";

/**
 * A div displaying centroid data
 * @param {Color} centroid
 * @return {Element}
 * @constructor
 */
const Centroid = ({ centroid }) => {
  const colorCode = centroid.stringify();
  // Text displayed under the color
  const [displayText, setDisplayText] = useState(colorCode);
  return (
    <div
      className={"centroid-block"}
      style={{ backgroundColor: centroid.stringify() }}
      onClick={async (e) => {
        // Click to copy color code hex, and set display text "copied" for 1 second
        try {
          await navigator.clipboard.writeText(colorCode);
          setDisplayText("Copied!");
          setTimeout(() => {
            setDisplayText(colorCode);
          }, 1000);
        } catch (err) {
          console.error("Failed to copy text");
        } finally {
          // Cancel css focus
          e.target.blur();
        }
      }}
      tabIndex={0}
    >
      <div className={"centroid-block-title"}>{displayText}</div>
    </div>
  );
};

/**
 * A flex div displaying a list of centroid data
 * @param {Array[Color]} centroids
 * @return {Element}
 * @constructor
 */
export const Centroids = ({ centroids }) => {
  return (
    <div id={"centroid-container"}>
      {centroids.map((centroid, i) => (
        <Centroid key={i} centroid={centroid} />
      ))}
    </div>
  );
};
