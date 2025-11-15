import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

export default function App() {
  // Padrões de código para o fundo
  const codePatterns = [
    "< html >",
    "{ code }",
    "$ npm run",
    "> console.log()",
    "📱 App"
  ];

  return (
    <div className="app">
      {/* Grid background */}
      <div className="app-bg"></div>

      {/* Padrão hexagonal animado */}
      <div className="app-hex"></div>

      {/* Partículas de código */}
      <div className="app-particles">
        {codePatterns.map((pattern, index) => (
          <div key={index} className="particle">
            {pattern}
          </div>
        ))}
      </div>

      {/* Linhas de conexão */}
      <div className="connection-line line-1"></div>
      <div className="connection-line line-2"></div>
      <div className="connection-line line-3"></div>

      {/* Pontos nodais */}
      <div className="node-dot"></div>
      <div className="node-dot"></div>
      <div className="node-dot"></div>
      <div className="node-dot"></div>

      {/* Navbar e conteúdo */}
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}
