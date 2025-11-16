import React from "react";
import "../styles/Responsive.css";

export default function ResponsiveTest() {
  return (
    <div className="responsive-container">
      <h1 className="text-fluid-xl">🎯 Teste de Responsividade</h1>

      <div className="space-y-lg">
        {/* Indicadores de breakpoint */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Breakpoints Ativos</h2>
          <div className="flex-responsive">
            <div
              className="bp-xs card"
              style={{ background: "#ff6b6b", color: "white" }}
            >
              📱 Extra Small (≤575px)
            </div>
            <div
              className="bp-sm card"
              style={{ background: "#4ecdc4", color: "white" }}
            >
              📱 Small (576-767px)
            </div>
            <div
              className="bp-md card"
              style={{ background: "#45b7d1", color: "white" }}
            >
              📲 Medium (768-991px)
            </div>
            <div
              className="bp-lg card"
              style={{ background: "#96ceb4", color: "white" }}
            >
              💻 Large (992-1199px)
            </div>
            <div
              className="bp-xl card"
              style={{ background: "#feca57", color: "white" }}
            >
              🖥️ Extra Large (1200-1399px)
            </div>
            <div
              className="bp-xxl card"
              style={{ background: "#ff9ff3", color: "white" }}
            >
              🖥️ XXL (≥1400px)
            </div>
          </div>
        </div>

        {/* Grid responsivo */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Grid Responsivo</h2>
          <div className="auto-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="card"
                style={{
                  background: "var(--primary)",
                  color: "white",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Card {num}
              </div>
            ))}
          </div>
        </div>

        {/* Visibilidade por dispositivo */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Visibilidade por Dispositivo</h2>
          <div className="space-y-md">
            <div
              className="show-mobile card"
              style={{ background: "#ff6b6b", color: "white" }}
            >
              📱 Visível apenas no mobile
            </div>
            <div
              className="show-tablet card"
              style={{ background: "#4ecdc4", color: "white" }}
            >
              📲 Visível apenas no tablet
            </div>
            <div
              className="show-desktop card"
              style={{ background: "#45b7d1", color: "white" }}
            >
              💻 Visível apenas no desktop
            </div>
            <div
              className="hide-mobile card"
              style={{ background: "#96ceb4", color: "white" }}
            >
              🚫📱 Oculto no mobile
            </div>
          </div>
        </div>

        {/* Layout de duas colunas */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Layout de Duas Colunas</h2>
          <div className="two-column">
            <div
              className="card"
              style={{ background: "var(--success)", color: "white" }}
            >
              <h3>Coluna 1</h3>
              <p>Esta é a primeira coluna que se adapta automaticamente.</p>
            </div>
            <div
              className="card"
              style={{ background: "var(--warning)", color: "white" }}
            >
              <h3>Coluna 2</h3>
              <p>Esta é a segunda coluna que fica embaixo em mobile.</p>
            </div>
          </div>
        </div>

        {/* Botões responsivos */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Botões Responsivos</h2>
          <div className="flex-responsive">
            <button
              className="btn-responsive"
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
              }}
            >
              Botão Primário
            </button>
            <button
              className="btn-responsive"
              style={{
                background: "var(--success)",
                color: "white",
                border: "none",
              }}
            >
              Botão Sucesso
            </button>
            <button
              className="btn-responsive"
              style={{
                background: "var(--danger)",
                color: "white",
                border: "none",
              }}
            >
              Botão Perigo
            </button>
          </div>
        </div>

        {/* Orientação */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Orientação</h2>
          <div
            className="landscape-only card"
            style={{ background: "#e74c3c", color: "white" }}
          >
            📱 Visível apenas em landscape
          </div>
          <div
            className="portrait-only card"
            style={{ background: "#3498db", color: "white" }}
          >
            📱 Visível apenas em portrait
          </div>
        </div>

        {/* Informações do dispositivo */}
        <div className="card-responsive">
          <h2 className="text-fluid-lg">Informações do Dispositivo</h2>
          <div className="space-y-sm">
            <div>📐 Largura da tela: {window.innerWidth}px</div>
            <div>📏 Altura da tela: {window.innerHeight}px</div>
            <div>
              🖱️ Suporte a hover:{" "}
              {window.matchMedia("(hover: hover)").matches ? "Sim" : "Não"}
            </div>
            <div>
              📱 É touch device: {"ontouchstart" in window ? "Sim" : "Não"}
            </div>
            <div>
              🔄 Orientação:{" "}
              {window.innerWidth > window.innerHeight
                ? "Landscape"
                : "Portrait"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
