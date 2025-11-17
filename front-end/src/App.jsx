import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./styles/theme.css";
import "./App.css";

export default function App() {

  const codePatterns = [
    "< html >",
    "{ code }",
    "$ npm run",
    "> console.log()",
    "📱 App"
  ];

  return (
    <div className="app">
      <div className="app-bg"></div>

      <div className="app-hex"></div>

      <div className="app-particles">
        {codePatterns.map((pattern, index) => (
          <div key={index} className="particle">
            {pattern}
          </div>
        ))}
      </div>

      <div className="connection-line line-1"></div>
      <div className="connection-line line-2"></div>
      <div className="connection-line line-3"></div>


      <div className="node-dot"></div>
      <div className="node-dot"></div>
      <div className="node-dot"></div>
      <div className="node-dot"></div>


      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}
