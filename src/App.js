import { useState } from "react";
import BackgroundSelector from "./components/BackgroundSelector";
import Canvas from "./components/Canvas";
import "./App.css";

const availableBackgrounds = ["bg1.png", "bg2.png", "bg3.png"];

function App() {
  const [background, setBackground] = useState(null);

  const handleBackgroundSelect = (fileName) => {
    const path = `${process.env.PUBLIC_URL}/backgrounds/${fileName}`;
    setBackground(path); // Make sure this is updating state correctly
  };

  const handleClearBackground = () => {
    setBackground(null);
  };

  return (
    <div className="app">
      <h1>Certificate Maker</h1>
      <BackgroundSelector
        availableBackgrounds={availableBackgrounds}
        onSelect={handleBackgroundSelect}
        onClear={handleClearBackground}
      />
      <Canvas background={background} />
    </div>
  );
}

export default App;
