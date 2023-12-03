import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";

/**
 * A full-screen drop zone
 * @param setBuffer
 * @param setDrop
 * @return {Element}
 * @constructor
 */
export const Dropzone = ({ setBuffer, setDrop }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Close drop zone
    setDrop(false);
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Read image as buffer and pass it to state
      const buffer = reader.result;
      setBuffer(buffer);
    };
    // Only accept first file
    reader.readAsArrayBuffer(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpe", ".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} id={"drop-zone"}>
      <input {...getInputProps()} />
      <h1>Drag and drop an image here, or click to select one</h1>
      <a
        href={"#"}
        className={"primary btn"}
        onClick={(e) => {
          e.stopPropagation();
          setDrop(false);
        }}
      >
        {/* Cancel button */}
        Cancel
      </a>
    </div>
  );
};
