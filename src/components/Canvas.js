// components/Canvas.js
import React, { useState } from "react";
import EditableText from "./EditableText";
import TextToolbar from "./TextToolbar";
import ImageElement from "./ImageElement";
import Papa from "papaparse";
import AlignmentGuides from "./AlignmentGuides";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "../App.css";

const toCamelCase = (str) =>
  str
    .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, (group1) => group1.toLowerCase());

const Canvas = ({ background }) => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const addTextBox = () => {
    const newBox = {
      text: "New Text with {NAME}",
      top: 100,
      left: 100,
      fontSize: "20px",
      bold: false,
      italic: false,
      align: "left",
      fontFamily: "Arial",
      color: "#000000",
      zIndex: textBoxes.length + images.length + 1,
    };
    setTextBoxes([...textBoxes, newBox]);
    setSelectedIndex(textBoxes.length);
    setSelectedImageIndex(null);
  };

  const updateTextBox = (index, newStyle) => {
    const updated = [...textBoxes];
    updated[index] = { ...updated[index], ...newStyle };
    setTextBoxes(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          src: reader.result,
          top: 150,
          left: 150,
          width: 100,
          height: 100,
          zIndex: textBoxes.length + images.length + 1,
        };
        setImages([...images, newImage]);
        setSelectedImageIndex(images.length);
        setSelectedIndex(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rows = results.data;
        setCsvData(rows);
        alert("CSV loaded! Now click 'Generate PDF'.");
      },
    });
  };

  const generatePDF = async () => {
    if (csvData.length === 0) {
      alert("Please upload a CSV file.");
      return;
    }

    const currentTemplate = [...textBoxes];
    const jsPDF = (await import("jspdf")).jsPDF;
    const html2canvas = (await import("html2canvas")).default;
    const canvasElement = document.querySelector(".certificate-canvas");
    const zip = new JSZip();
    const firstKey = Object.keys(csvData[0])[0];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const filledBoxes = currentTemplate.map((box) => {
        let replaced = box.text;
        Object.keys(row).forEach((key) => {
          replaced = replaced.replaceAll(`{${key}}`, row[key]);
        });
        return { ...box, text: replaced };
      });

      setTextBoxes(filledBoxes);
      setSelectedIndex(null);
      setSelectedImageIndex(null);
      await new Promise((r) => setTimeout(r, 300));

      canvasElement.classList.remove("bordered-canvas");

      const canvasImage = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        windowWidth: canvasElement.scrollWidth,
        windowHeight: canvasElement.scrollHeight,
      });

      canvasElement.classList.add("bordered-canvas");

      const imgData = canvasImage.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1000, 707] });
      pdf.addImage(imgData, "PNG", 0, 0, 1000, 707);

      const pdfBlob = pdf.output("blob");
      const fileName = toCamelCase(row[firstKey] || `certificate${i + 1}`) + ".pdf";
      zip.file(fileName, pdfBlob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "certificates.zip");
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="canvas-container">
      <div style={{ marginBottom: "10px" }}>
        <button onClick={addTextBox}>➕ Add Text</button>

        <label> Upload image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginLeft: "10px" }}
        />

        <label> Upload Data</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={generatePDF}
          style={{ marginLeft: "10px", backgroundColor: "#4caf50", color: "white" }}
        >
          📄 Generate PDF
        </button>

        <button
          onClick={() => downloadJSON(textBoxes, "certificate-template.json")}
          style={{ marginLeft: "10px" }}
        >
          💾 Save Template
        </button>

        <label> Upload Template</label>
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const loaded = JSON.parse(event.target.result);
                setTextBoxes(loaded);
                setSelectedIndex(null);
                setSelectedImageIndex(null);
                alert("Template loaded!");
              } catch (err) {
                alert("Invalid JSON file.");
              }
            };
            reader.readAsText(file);
          }}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {selectedIndex !== null && (
        <TextToolbar
          style={textBoxes[selectedIndex]}
          onUpdate={(newStyle) => updateTextBox(selectedIndex, newStyle)}
        />
      )}

      <div
        className="certificate-canvas bordered-canvas"
        style={{
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflow: "visible",
        }}
        onMouseDown={(e) => {
          if (e.target.classList.contains("certificate-canvas")) {
            setSelectedIndex(null);
            setSelectedImageIndex(null);
          }
        }}
      >
        <AlignmentGuides textBoxes={textBoxes} selectedIndex={selectedIndex} />

        {images.map((img, index) => (
          <ImageElement
            key={`img-${index}`}
            src={img.src}
            style={img}
            isSelected={index === selectedImageIndex}
            onSelect={() => {
              setSelectedImageIndex(index);
              setSelectedIndex(null);
            }}
            onUpdate={(newStyle) => {
              const updated = [...images];
              updated[index] = { ...updated[index], ...newStyle };
              setImages(updated);
            }}
            onDelete={() => {
              const updated = [...images];
              updated.splice(index, 1);
              setImages(updated);
              setSelectedImageIndex(null);
            }}
          />
        ))}

        {textBoxes.map((box, index) => (
          <EditableText
            key={`text-${index}`}
            text={box.text}
            style={box}
            isSelected={index === selectedIndex}
            onSelect={() => {
              setSelectedIndex(index);
              setSelectedImageIndex(null);
            }}
            onChange={(newStyle) => updateTextBox(index, newStyle)}
            onDragEnd={(newStyle) => updateTextBox(index, newStyle)}
            onDelete={() => {
              const updated = [...textBoxes];
              updated.splice(index, 1);
              setTextBoxes(updated);
              setSelectedIndex(null);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
