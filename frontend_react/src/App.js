import React, { useState } from "react";
import "./App.css";

// Car model data — could come from API/backend in a real app
const CAR_MODELS = [
  {
    id: "sedan",
    name: "Sedan",
    basePrice: 25000,
    image: "/car_sedan.png", // Placeholder - see Visualizer section for actual SVG
    colors: ["#003366", "#E63946", "#CCCCCC", "#222222"],
    features: [
      { key: "leatherSeats", name: "Leather Seats", price: 1000 },
      { key: "sunroof", name: "Sunroof", price: 1200 },
      { key: "sportWheels", name: "Sport Wheels", price: 850 },
    ],
  },
  {
    id: "suv",
    name: "SUV",
    basePrice: 35000,
    image: "/car_suv.png",
    colors: ["#003366", "#E63946", "#CCCCCC", "#222222"],
    features: [
      { key: "leatherSeats", name: "Leather Seats", price: 1200 },
      { key: "sunroof", name: "Sunroof", price: 1400 },
      { key: "advancedNav", name: "Advanced Navigation", price: 900 },
      { key: "towingPackage", name: "Towing Package", price: 1600 },
    ],
  },
  {
    id: "hatchback",
    name: "Hatchback",
    basePrice: 18000,
    image: "/car_hatchback.png",
    colors: ["#003366", "#E63946", "#CCCCCC", "#222222"],
    features: [
      { key: "leatherSeats", name: "Leather Seats", price: 800 },
      { key: "sportWheels", name: "Sport Wheels", price: 600 },
      { key: "roofRack", name: "Roof Rack", price: 400 },
    ],
  },
];

// PUBLIC_INTERFACE
function App() {
  const [selectedModelId, setSelectedModelId] = useState(CAR_MODELS[0].id);
  const [selectedColor, setSelectedColor] = useState(CAR_MODELS[0].colors[0]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Get current chosen model object
  const selectedModel = CAR_MODELS.find((m) => m.id === selectedModelId);

  // Sync color and features if model changes
  React.useEffect(() => {
    setSelectedColor(selectedModel.colors[0]);
    setSelectedFeatures([]);
  }, [selectedModelId]);

  // Toggle feature selection
  const handleFeatureToggle = (key) => {
    setSelectedFeatures((prev) =>
      prev.includes(key)
        ? prev.filter((f) => f !== key)
        : [...prev, key]
    );
  };

  // Compute pricing
  const totalPrice =
    selectedModel.basePrice +
    selectedModel.features
      .filter((feature) => selectedFeatures.includes(feature.key))
      .reduce((sum, feature) => sum + feature.price, 0);

  // Responsive handler for sidebar
  const handleSidebarToggle = () => setShowSidebar((s) => !s);

  return (
    <div className="carconfig-app">
      <Navbar />
      <div className="carconfig-main-layout">
        <Sidebar
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          models={CAR_MODELS}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          colors={selectedModel.colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          features={selectedModel.features}
          selectedFeatures={selectedFeatures}
          handleFeatureToggle={handleFeatureToggle}
        />
        <div className="carconfig-canvas-flex">
          <button
            className="sidebar-toggle-btn"
            onClick={handleSidebarToggle}
            aria-label="Show configuration options"
          >
            ☰
          </button>
          <Visualizer
            model={selectedModel}
            color={selectedColor}
            features={selectedFeatures}
          />
        </div>
      </div>
      <SummaryFooter
        model={selectedModel}
        color={selectedColor}
        features={selectedFeatures}
        totalPrice={totalPrice}
      />
    </div>
  );
}

// Top Navigation Bar
function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">
        <span className="logo-dot"></span>Car Configurator
      </span>
      <span className="navbar-link">Modern | Customizable | Visual</span>
    </nav>
  );
}

// Sidebar for model, color, feature selection
function Sidebar({
  open,
  onClose,
  models,
  selectedModelId,
  setSelectedModelId,
  colors,
  selectedColor,
  setSelectedColor,
  features,
  selectedFeatures,
  handleFeatureToggle,
}) {
  // Hide sidebar on mobile overlay click
  return (
    <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h2>Options</h2>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          ×
        </button>
      </div>
      <div className="sidebar-section">
        <label className="sidebar-label">Car Model</label>
        <div className="model-list">
          {models.map((model) => (
            <button
              key={model.id}
              className={`model-btn${selectedModelId === model.id ? " selected" : ""}`}
              style={selectedModelId === model.id
                ? { borderColor: "var(--primary-color)" }
                : {}
              }
              onClick={() => setSelectedModelId(model.id)}
              aria-pressed={selectedModelId === model.id}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <label className="sidebar-label">Color</label>
        <div className="color-palette">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-circle${selectedColor === color ? " selected" : ""}`}
              style={{ backgroundColor: color, borderColor: selectedColor === color ? "var(--accent-color)" : "#eee" }}
              onClick={() => setSelectedColor(color)}
              aria-pressed={selectedColor === color}
            />
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <label className="sidebar-label">Features</label>
        <ul className="feature-list">
          {features.map((feature) => (
            <li key={feature.key}>
              <label className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.key)}
                  onChange={() => handleFeatureToggle(feature.key)}
                />
                {feature.name}{" "}
                <span className="feature-price">
                  (+${feature.price.toLocaleString()})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// Main Car Visualizer
function Visualizer({ model, color, features }) {
  // Simple SVG cartoon car as visual. Extra effects for features.
  // In a real app, this may be an imported image, WebGL, or actual car models.

  // Feature rendering: show extra icons on roof for sunroof/roof rack/towing etc.
  // Color the car body by selected color.
  return (
    <div className="canvas-container">
      <h2 className="canvas-title">{model.name} Preview</h2>
      <div className="car-svg-wrapper">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 120"
          className="car-svg"
          aria-label="Car visual"
        >
          {/* Car Body */}
          <rect
            x="45"
            y="60"
            width="190"
            height="35"
            rx="15"
            fill={color}
            stroke="#222"
            strokeWidth="3"
          />
          {/* Car Roof */}
          <rect
            x="90"
            y="40"
            width="100"
            height="30"
            rx="10"
            fill={color}
            stroke="#444"
            strokeWidth="2"
          />
          {/* Windows */}
          <rect x="105" y="46" width="30" height="20" rx="4" fill="#eee" />
          <rect x="145" y="46" width="35" height="20" rx="4" fill="#eee" />
          {/* Wheels */}
          <circle cx="75" cy="100" r="17" fill="#cccccc" stroke="#222" strokeWidth="4" />
          <circle cx="210" cy="100" r="17" fill="#cccccc" stroke="#222" strokeWidth="4" />
          {/* Sport Wheels (feature) */}
          {features.includes("sportWheels") && (
            <>
              <circle cx="75" cy="100" r="10" fill="#E63946" />
              <circle cx="210" cy="100" r="10" fill="#E63946" />
            </>
          )}
          {/* Sunroof */}
          {features.includes("sunroof") && (
            <rect x="155" y="45" width="25" height="11" rx="3" fill="#E63946" stroke="#222" strokeWidth="1.5" />
          )}
          {/* Roof Rack */}
          {features.includes("roofRack") && (
            <>
              <rect x="92" y="37" width="25" height="4" rx="2" fill="#333" />
              <rect x="163" y="37" width="25" height="4" rx="2" fill="#333" />
            </>
          )}
          {/* Towing Package */}
          {features.includes("towingPackage") && (
            <rect x="235" y="80" width="13" height="14" rx="2" fill="#E63946" stroke="#111" strokeWidth="1" />
          )}
          {/* Leather Seats Indicator */}
          {features.includes("leatherSeats") && (
            <rect x="130" y="62" width="18" height="17" rx="3" fill="#c09060" stroke="#b45309" strokeWidth="2" />
          )}
          {/* Navigation Icon */}
          {features.includes("advancedNav") && (
            <circle cx="155" cy="70" r="6" fill="#E63946" stroke="#333" strokeWidth="3" />
          )}
        </svg>
      </div>
    </div>
  );
}

// Summary footer
function SummaryFooter({ model, color, features, totalPrice }) {
  // Feature names for summary
  const chosenFeatures = model.features.filter((f) => features.includes(f.key));
  const colorName = getColorName(color);

  return (
    <footer className="summary-footer">
      <div className="footer-group">
        <span className="footer-label">Model:</span>
        <span>{model.name}</span>
      </div>
      <div className="footer-group">
        <span className="footer-label">Color:</span>
        <span>
          <span
            className="footer-color-dot"
            style={{ backgroundColor: color }}
            aria-label={colorName}
          />
          {colorName}
        </span>
      </div>
      <div className="footer-group feature-list-footer">
        <span className="footer-label">Features:</span>
        {chosenFeatures.length > 0 ? (
          <span>
            {chosenFeatures.map((f) => f.name).join(", ")}
          </span>
        ) : (
          <span>None</span>
        )}
      </div>
      <div className="footer-group">
        <span className="footer-label">Total:</span>
        <span className="footer-price">${totalPrice.toLocaleString()}</span>
      </div>
    </footer>
  );
}

// Utility to get human color name — can customize based on palette.
function getColorName(hex) {
  switch (hex.toLowerCase()) {
    case "#003366":
      return "Deep Blue";
    case "#e63946":
      return "Crimson Red";
    case "#cccccc":
      return "Silver";
    case "#222222":
      return "Graphite";
    default:
      return hex;
  }
}
export default App;
