// =========================================================================
// BARRA LATERAL DE NAVEGACIÓN INDUSTRIAL (SIDEBAR)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { DEMO_NOTICE } from "../data/initialData.js";

export function renderSidebar(state) {
  const currentView = state.currentView;
  const activeOrdersCount = state.orders.filter(
    (o) => o.status === "En curso" || o.status === "Con incidencias"
  ).length;
  const scheduledCount = state.orders.filter((o) => o.status === "Programada").length;

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand-icon">U</div>
        <div class="brand-title">
          ULTRASECO
          <span class="brand-subtitle">Control de Recetas v2.4</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Control de Producción</div>
        
        <div class="nav-item ${currentView === "dashboard" ? "active" : ""}" data-nav="dashboard">
          ${icon("Gauge", { size: 19 })}
          <span>Panel de Producción</span>
        </div>

        <div class="nav-item ${currentView === "orders" ? "active" : ""}" data-nav="orders">
          ${icon("FileSpreadsheet", { size: 19 })}
          <span>Órdenes de Fabricación</span>
          ${scheduledCount > 0 ? `<span class="nav-badge">${scheduledCount}</span>` : ""}
        </div>

        <div class="nav-item ${currentView === "execution" ? "active" : ""}" data-nav="execution">
          ${icon("Activity", { size: 19 })}
          <span>Ejecución en Planta</span>
          ${activeOrdersCount > 0 ? `<span class="nav-badge alert">${activeOrdersCount}</span>` : ""}
        </div>

        <div class="nav-section-title">Ingeniería & Formulación</div>

        <div class="nav-item ${currentView === "products" ? "active" : ""}" data-nav="products">
          ${icon("Package", { size: 19 })}
          <span>Catálogo de Productos</span>
        </div>

        <div class="nav-item ${currentView === "recipes" ? "active" : ""}" data-nav="recipes">
          ${icon("FlaskConical", { size: 19 })}
          <span>Gestión de Recetas</span>
        </div>

        <div class="nav-item ${currentView === "calculator" ? "active" : ""}" data-nav="calculator">
          ${icon("Scale", { size: 19 })}
          <span>Calculadora de Lotes</span>
        </div>

        <div class="nav-section-title">Control & Calidad</div>

        <div class="nav-item ${currentView === "reports" ? "active" : ""}" data-nav="reports">
          ${icon("History", { size: 19 })}
          <span>Historial e Informes</span>
        </div>

        <div class="nav-item ${currentView === "audit" ? "active" : ""}" data-nav="audit">
          ${icon("ShieldCheck", { size: 19 })}
          <span>Registro de Auditoría</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="disclaimer-pill">
          ${icon("AlertTriangle", { size: 14, className: "inline-block mb-1" })}<br>
          <strong>${DEMO_NOTICE}</strong><br>
          <span style="font-size:0.65rem; opacity:0.85;">Herramienta de cálculo y registro operativo</span>
        </div>
      </div>
    </aside>
  `;
}

export function bindSidebarEvents(container) {
  container.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const targetView = el.getAttribute("data-nav");
      store.navigate(targetView);
    });
  });
}
