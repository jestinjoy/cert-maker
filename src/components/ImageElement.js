// components/ImageElement.js
import React, { useState, useRef, useEffect } from "react";

const ImageElement = ({ src, style, onUpdate, isSelected, onSelect, onDelete }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging && !resizing) return;

      const canvas = document.querySelector(".certificate-canvas");
      const canvasRect = canvas.getBoundingClientRect();

      if (dragging) {
        let newLeft = e.clientX - canvasRect.left - offset.current.x;
        let newTop = e.clientY - canvasRect.top - offset.current.y;

        newLeft = Math.max(0, Math.min(newLeft, canvasRect.width - style.width));
        newTop = Math.max(0, Math.min(newTop, canvasRect.height - style.height));

        onUpdate({ ...style, left: newLeft, top: newTop });
      }

      if (resizing) {
        const deltaX = e.clientX - offset.current.x;
        const deltaY = e.clientY - offset.current.y;
        const newWidth = Math.max(20, style.width + deltaX);
        const newHeight = Math.max(20, style.height + deltaY);
        onUpdate({ ...style, width: newWidth, height: newHeight });
        offset.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, style, onUpdate]);

  const startDrag = (e) => {
    const rect = elementRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setDragging(true);
    onSelect();
  };

  const startResize = (e) => {
    e.stopPropagation();
    offset.current = { x: e.clientX, y: e.clientY };
    setResizing(true);
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={startDrag}
      onClick={onSelect}
      style={{
        position: "absolute",
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.height,
        border: isSelected ? "2px dashed #28a745" : "none",
        zIndex: style.zIndex || 1,
        cursor: "move",
      }}
    >
      <img
        src={src}
        alt="uploaded"
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {isSelected && (
        <>
          <div
            onMouseDown={startResize}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "10px",
              height: "10px",
              background: "#28a745",
              cursor: "se-resize",
            }}
          />
          <button
            onClick={onDelete}
            style={{
              position: "absolute",
              top: "-15px",
              right: "-15px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

export default ImageElement;
