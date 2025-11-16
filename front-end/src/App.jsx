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
    "📱 App",
  ];

  return (
    <div className="app">
      {/* Background decorativo Matrix */}
      <div className="app-matrix-bg">
        {/* Grid animado */}
        <div className="app-grid"></div>

        {/* Esferas de gradiente flutuantes */}
        <div className="gradient-sphere gradient-sphere-1"></div>
        <div className="gradient-sphere gradient-sphere-2"></div>
        <div className="gradient-sphere gradient-sphere-3"></div>
      </div>

      {/* Padrão hexagonal animado */}
      <div className="app-hex"></div>

      {/* Partículas de código */}
      <div className="app-particles">
        {codePatterns.map((pattern, index) => (
          <div key={index} className="code-particle">
            {pattern}
          </div>
        ))}

        {/* Partículas flutuantes */}
        {[...Array(8)].map((_, index) => (
          <div
            key={`particle-${index}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          ></div>
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
