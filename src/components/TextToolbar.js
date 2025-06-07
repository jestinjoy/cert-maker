// components/TextToolbar.js
import React from "react";

const fonts = ["Arial", "Georgia", "Courier New", "Verdana", "Times New Roman"];

const TextToolbar = ({ style, onUpdate }) => {
  const update = (changes) => onUpdate({ ...style, ...changes });

  return (
    <div className="text-toolbar">
      <label>
        Font Size:
        <input
          type="number"
          value={parseInt(style.fontSize)}
          onChange={(e) => update({ fontSize: `${e.target.value}px` })}
          min="10"
        />
      </label>

      <label>
        Font:
        <select
          value={style.fontFamily || "Arial"}
          onChange={(e) => update({ fontFamily: e.target.value })}
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>

      <label>
        Color:
        <input
          type="color"
          value={style.color || "#000000"}
          onChange={(e) => update({ color: e.target.value })}
        />
      </label>

      <button onClick={() => update({ bold: !style.bold })}>
        {style.bold ? "Unbold" : "Bold"}
      </button>
      <button onClick={() => update({ italic: !style.italic })}>
        {style.italic ? "Unitalic" : "Italic"}
      </button>

      <label>
        Align:
        <select
          value={style.align}
          onChange={(e) => update({ align: e.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>

      <button onClick={() => update({ zIndex: (style.zIndex || 1) + 1 })}>
        ⬆ Front
      </button>
      <button
        onClick={() =>
          update({ zIndex: Math.max(0, (style.zIndex || 1) - 1) })
        }
      >
        ⬇ Back
      </button>
    </div>
  );
};

export default TextToolbar;
