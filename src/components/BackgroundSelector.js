// src/components/BackgroundSelector.js
import React from "react";
import "../App.css";

const BackgroundSelector = ({ availableBackgrounds, onSelect, onClear }) => {
  return (
    <div className="controls">
      <div className="background-selector">
        {availableBackgrounds.map((file, idx) => (
          <img
            key={idx}
            src={`${process.env.PUBLIC_URL}/backgrounds/${file}`}
            alt={`Background ${idx + 1}`}
            className="thumbnail"
            onClick={() => onSelect(file)}
          />
        ))}
      </div>
      <button onClick={onClear}>Clear Background</button>
    </div>
  );
};

export default BackgroundSelector;
