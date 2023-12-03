import React, { useEffect, useState } from "react";
import ColorBuffer from "./ColorBuffer";

export const ImageLoader = ({ buffer, setCentroids }) => {
  const [url, setUrl] = useState("");
  const [opacity, setOpacity] = useState(0);
  const drawCanvas = (buffer) => {
    const blob = new Blob([buffer], { type: "image/png" });
    const blobUrl = URL.createObjectURL(blob);
    setUrl((oldUrl) => {
      URL.revokeObjectURL(oldUrl);
      return blobUrl;
    });
    const img = new Image();
    img.src = blobUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const ratio = 128 / Math.max(img.width, img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const colorBuffer = new ColorBuffer(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      );
      colorBuffer.cluster(5).then((centroids) => {
        setCentroids(centroids);
        const root = document.querySelector(":root");
        root.style.setProperty("--on-primary", centroids[0].stringify());
        root.style.setProperty("--background", centroids[0].stringify());
        root.style.setProperty("--tri-primary", centroids[1].stringify());
        root.style.setProperty("--second-primary", centroids[2].stringify());
        root.style.setProperty("--primary", centroids[3].stringify());
        root.style.setProperty("--on-background", centroids[4].stringify());
      });
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
