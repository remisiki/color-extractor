import React, {useEffect, useState} from "react";
import ColorBuffer from "./ColorBuffer";

/**
 * Loads an image from buffer and display it on screen, asynchronously calculate centroids
 * @param {ArrayBuffer} buffer
 * @param setCentroids
 * @return {Element} An \<img\> element
 * @constructor
 */
export const ImageLoader = ({ buffer, setCentroids }) => {
  // Temp blob url
  const [url, setUrl] = useState("");
  // Img opacity, init 0 (invisible)
  const [opacity, setOpacity] = useState(0);
  /**
   * draw an image buffer on canvas for further calculation
   * @param {ArrayBuffer} buffer
   */
  const drawCanvas = (buffer) => {
    // Draw as png with 4 channels
    const blob = new Blob([buffer], { type: "image/png" });
    const blobUrl = URL.createObjectURL(blob);
    setUrl((oldUrl) => {
      // Revoke old url before setting new one
      URL.revokeObjectURL(oldUrl);
      return blobUrl;
    });
    const img = new Image();
    img.src = blobUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // Scale image to longer side smaller than 128
      // This prevents k-Means from running on too large arrays
      // 128 is enough to extract major colors
      const ratio = 128 / Math.max(img.width, img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Store image as a new buffer in lab space
      const colorBuffer = new ColorBuffer(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      );
      // Run k-Means clustering with `k=5`
      colorBuffer.cluster(5).then((centroids) => {
        // Pass to state
        setCentroids(centroids);
        // Set css properties accordingly
        const root = document.querySelector(":root");
        root.style.setProperty("--on-primary", centroids[0].stringify());
        root.style.setProperty("--background", centroids[0].stringify());
        root.style.setProperty("--tri-primary", centroids[1].stringify());
        root.style.setProperty("--second-primary", centroids[2].stringify());
        root.style.setProperty("--primary", centroids[3].stringify());
        root.style.setProperty("--on-background", centroids[4].stringify());
      });
      // Animate to show the image
      setOpacity(1);
    };
  };
  useEffect(() => {
    drawCanvas(buffer);
  }, [buffer]);
  return (
    <img
      src={url}
      alt={"uploaded image"}
      id={"image-loader"}
      style={{ opacity: opacity }}
    />
  );
};
