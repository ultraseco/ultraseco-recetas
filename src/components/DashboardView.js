// =========================================================================
// PANEL DE CONTROL PRINCIPAL DE PRODUCCIÓN (DASHBOARD)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, getStatusBadge } from "../utils/formatters.js";
import { SAFETY_DISCLAIMER, DEMO_NOTICE } from "../data/initialData.js";

export function renderDashboard(state) {
  const query = (state.searchQuery || "").toLowerCase();
  
  // Filtrar órdenes por búsqueda global
  const filteredOrders = state.orders.filter((o) => {
    if (!query) return true;
    return (
      o.id.toLowerCase().includes(query) ||
      o.batchNumber.toLowerCase().includes(query) ||
      o.productName.toLowerCase().includes(query) ||
      (o.operatorAssigned && o.operatorAssigned.toLowerCase().includes(query)) ||
      (o.status && o.status.toLowerCase().includes(query))
    );
  });

  // Métricas
  const scheduled = state.orders.filter((o) => o.status === "Programada").length;
  const inProgress = state.orders.filter((o) => o.status === "En curso").length;
  const completed = state.orders.filter((o) => o.status === "Completada").length;
  const withIncidents = state.orders.filter((o) => o.status === "Con incidencias").length;

  const totalKgToday = state.orders
    .filter((o) => o.status === "Completada" || o.status === "En curso")
    .reduce((acc, o) => acc + (o.batchSize || 0), 0);

  const pendingApprovalsCount = state.recipes.filter(
    (r) => r.status === "Pendiente de aprobación" || r.status === "Borrador"
  ).length;

  return `
    <div class="content-view">
      <!-- Banner de Seguridad Mandatorio -->
      <div class="safety-alert-banner">
        <div style="flex-shrink:0;">${icon("AlertTriangle", { size: 24, stroke: "#dc2626" })}</div>
        <div>
          <strong>${DEMO_NOTICE}</strong> — ${SAFETY_DISCLAIMER}
        </div>
      </div>

      <!-- Cabecera de Vista -->
      <div class="view-header">
        <div class="view-title-group">
          <h1>Panel de Producción Química</h1>
          <p>Supervisión en tiempo real de lotes, reactores químicos y estado de órdenes operativas</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-secondary" id="btn-quick-calc">
            ${icon("Scale", { size: 17 })}
            <span>Calcular Lote</span>
          </button>
          <button class="btn btn-primary" id="btn-quick-order">
            ${icon("Plus", { size: 17 })}
            <span>Nueva Orden de Fabricación</span>
          </button>
        </div>
      </div>

      <!-- Cuadrícula de Métricas KPI -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-box blue">
            ${icon("Activity", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${inProgress}</span>
            <span class="kpi-label">Lotes en Curso en Reactores</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box amber">
            ${icon("Clock", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${scheduled}</span>
            <span class="kpi-label">Lotes Programados Turno</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box emerald">
            ${icon("CheckCircle", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${completed}</span>
            <span class="kpi-label">Lotes Completados y Liberados</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box rose">
            ${icon("AlertCircle", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${withIncidents}</span>
            <span class="kpi-label">Lotes con Incidencias</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box purple">
            ${icon("FlaskConical", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${formatNumber(totalKgToday, 0)} kg</span>
            <span class="kpi-label">Volumen Total en Proceso</span>
          </div>
        </div>
      </div>

      <!-- Alertas de Calidad e Ingeniería -->
      ${
        pendingApprovalsCount > 0
          ? `
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 5px solid #d97706; border-radius: var(--radius-md); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display:flex; align-items:center; gap:0.75rem; color:#92400e;">
            ${icon("Info", { size: 20 })}
            <span>Hay <strong>${pendingApprovalsCount} receta(s) en borrador o pendientes de aprobación</strong> técnica. Recuerde que ninguna receta en borrador puede fabricarse sin aprobación formal.</span>
          </div>
          <button class="btn btn-warning btn-sm" id="btn-go-recipes">
            Revisar Recetas
          </button>
        </div>
      `
          : ""
      }

      <!-- Tabla de Órdenes del Día -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            ${icon("FileSpreadsheet", { size: 19 })}
            <span>Órdenes de Fabricación Activas y Tareas del Día</span>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">
            Mostrando ${filteredOrders.length} orden(es)
          </span>
        </div>

        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Orden / Lote</th>
                <th>Producto Químico</th>
                <th>Tamaño Lote</th>
                <th>Equipo / Reactor</th>
                <th>Estado</th>
                <th>Operario Asignado</th>
                <th>Fecha Prog.</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredOrders.length === 0
                  ? `
                <tr>
                  <td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
                    No se encontraron órdenes que coincidan con la búsqueda.
                  </td>
                </tr>
              `
                  : filteredOrders
                      .map((o) => {
                        const badge = getStatusBadge(o.status);
                        return `
                    <tr>
                      <td>
                        <strong style="color:var(--color-primary);">${o.id}</strong><br>
                        <span class="code-pill font-mono" style="font-size:0.75rem; color:var(--text-muted);">${o.batchNumber}</span>
                      </td>
                      <td>
                        <strong>${o.productName}</strong><br>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Receta: ${o.recipeVersion}</span>
                      </td>
                      <td>
                        <span class="font-mono" style="font-weight:700;">${formatNumber(o.batchSize, 1)} ${o.batchUnit}</span><br>
                        <span style="font-size:0.72rem; color:var(--text-muted);">Escala: ${o.scaleFactor}x</span>
                      </td>
                      <td>
                        <span style="font-size:0.82rem; font-weight:600;">${o.targetReactor}</span>
                      </td>
                      <td>
                        <span class="badge ${badge.bg}">
                          <span class="badge-dot" style="background-color: ${badge.dot ? badge.dot.replace('bg-', '') : 'currentColor'};"></span>
                          ${badge.text}
                        </span>
                      </td>
                      <td>
                        <span style="font-size:0.85rem;">${o.operatorAssigned}</span>
                      </td>
                      <td>
                        <span style="font-size:0.82rem; color:var(--text-muted);">${formatDate(o.scheduledDate)}</span>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-secondary btn-sm" data-action="open-execution" data-order-id="${o.id}">
                          ${icon("Activity", { size: 14 })}
                          <span>Hoja de Planta</span>
                        </button>
                      </td>
                    </tr>
                  `;
                      })
                      .join("")
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindDashboardEvents(container) {
  const btnQuickOrder = container.querySelector("#btn-quick-order");
  if (btnQuickOrder) {
    btnQuickOrder.addEventListener("click", () => {
      store.openModal("createOrder");
    });
  }

  const btnQuickCalc = container.querySelector("#btn-quick-calc");
  if (btnQuickCalc) {
    btnQuickCalc.addEventListener("click", () => {
      store.navigate("calculator");
    });
  }

  const btnGoRecipes = container.querySelector("#btn-go-recipes");
  if (btnGoRecipes) {
    btnGoRecipes.addEventListener("click", () => {
      store.navigate("recipes");
    });
  }

  container.querySelectorAll("[data-action='open-execution']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      store.navigate("execution", { orderId });
    });
  });
}
