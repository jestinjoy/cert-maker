import React, { useState, useRef, useEffect } from "react";

const EditableText = ({
  text,
  style,
  onChange,
  onDragEnd,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const canvas = document.querySelector(".certificate-canvas");
        const canvasRect = canvas.getBoundingClientRect();
        const element = elementRef.current;

        let newLeft = e.clientX - canvasRect.left - offset.current.x;
        let newTop = e.clientY - canvasRect.top - offset.current.y;

        newLeft = Math.max(0, Math.min(newLeft, canvasRect.width - element.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, canvasRect.height - element.offsetHeight));

        onDragEnd({ ...style, left: newLeft, top: newTop });
      }

      if (resizing) {
        const rect = elementRef.current.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        const newHeight = e.clientY - rect.top;

        onChange({
          ...style,
          width: Math.max(50, newWidth),
          height: Math.max(30, newHeight),
        });
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
  }, [dragging, resizing, onChange, onDragEnd, style]);

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
    setResizing(true);
    onSelect();
  };

  const handleInputChange = (e) => {
    onChange({ ...style, text: e.target.value });
  };

  return (
    <div
      ref={elementRef}
      className="editable-text"
      onMouseDown={startDrag}
      style={{
        position: "absolute",
        left: style.left,
        top: style.top,
        width: style.width || 200,
        height: style.height || "auto",
        cursor: "move",
        userSelect: "none",
        border: isSelected ? "1px dashed #007bff" : "none",
        padding: "4px",
        backgroundColor: "transparent",
        boxSizing: "border-box",
        zIndex: style.zIndex || 1,
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          ❌
        </button>
      )}

      <textarea
        value={text}
        onChange={handleInputChange}
        style={{
          fontSize: style.fontSize,
          fontWeight: style.bold ? "bold" : "normal",
          fontStyle: style.italic ? "italic" : "normal",
          textAlign: style.align,
          color: style.color || "#000000",
          fontFamily: style.fontFamily || "Arial",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      />

      {isSelected && (
        <div
          onMouseDown={startResize}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            bottom: "0px",
            right: "0px",
            backgroundColor: "#007bff",
            cursor: "nwse-resize",
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default EditableText;
