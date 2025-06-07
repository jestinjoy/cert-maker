// Add this inside your Canvas.js or as a separate component if preferred

import React from "react";

const AlignmentGuides = ({ textBoxes, selectedIndex }) => {
  const guideStyle = {
    position: "absolute",
    backgroundColor: "rgba(0, 123, 255, 0.5)",
    zIndex: 1000,
    pointerEvents: "none",
  };

  const guides = [];

  if (selectedIndex === null) return null;

  const selected = textBoxes[selectedIndex];

  textBoxes.forEach((box, idx) => {
    if (idx === selectedIndex) return;

    // Vertical alignment (left or right edge)
    if (Math.abs(box.left - selected.left) < 5) {
      guides.push(
        <div
          key={`v-left-${idx}`}
          style={{ ...guideStyle, left: box.left, top: 0, bottom: 0, width: 1 }}
        />
      );
    }

    const selectedRight = selected.left + (selected.width || 200);
    const boxRight = box.left + (box.width || 200);
    if (Math.abs(boxRight - selectedRight) < 5) {
      guides.push(
        <div
          key={`v-right-${idx}`}
          style={{ ...guideStyle, left: boxRight, top: 0, bottom: 0, width: 1 }}
        />
      );
    }

    // Horizontal alignment (top or bottom)
    if (Math.abs(box.top - selected.top) < 5) {
      guides.push(
        <div
          key={`h-top-${idx}`}
          style={{ ...guideStyle, top: box.top, left: 0, right: 0, height: 1 }}
        />
      );
    }

    const selectedBottom = selected.top + (selected.height || 50);
    const boxBottom = box.top + (box.height || 50);
    if (Math.abs(boxBottom - selectedBottom) < 5) {
      guides.push(
        <div
          key={`h-bottom-${idx}`}
          style={{ ...guideStyle, top: boxBottom, left: 0, right: 0, height: 1 }}
        />
      );
    }
  });

  return <>{guides}</>;
};

export default AlignmentGuides;
