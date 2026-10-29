// =========================================================================
// HISTORIAL, INFORMES DE PRODUCCIÓN Y TRAZABILIDAD
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, formatDateTime, getStatusBadge } from "../utils/formatters.js";

let reportProductFilter = "all";
let reportStatusFilter = "all";

export function renderReports(state) {
  const query = (state.searchQuery || "").toLowerCase();

  const filteredOrders = state.orders.filter((o) => {
    const matchesProduct = reportProductFilter === "all" || o.productId === reportProductFilter;
    const matchesStatus = reportStatusFilter === "all" || o.status === reportStatusFilter;
    const matchesSearch =
      !query ||
      o.batchNumber.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query) ||
      o.productName.toLowerCase().includes(query) ||
      (o.operatorAssigned && o.operatorAssigned.toLowerCase().includes(query));

    return matchesProduct && matchesStatus && matchesSearch;
  });

  // Estadísticas globales de trazabilidad
  const completedOrders = state.orders.filter((o) => o.status === "Completada");
  const totalKgProduced = completedOrders.reduce((sum, o) => sum + (o.batchSize || 0), 0);
  
  // Calcular rendimiento promedio de pesaje
  let totalDeviations = [];
  completedOrders.forEach((o) => {
    (o.components || []).forEach((c) => {
      if (c.deviationPct !== null && c.deviationPct !== undefined) {
        totalDeviations.push(Math.abs(c.deviationPct));
      }
    });
  });
  const avgDeviation = totalDeviations.length > 0 
    ? (totalDeviations.reduce((a, b) => a + b, 0) / totalDeviations.length).toFixed(2) 
    : "0.00";

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Informes de Producción & Trazabilidad Química</h1>
          <p>Auditoría de lotes, balance planificado vs real, materias primas utilizadas y control de rendimientos</p>
        </div>
        <button class="btn btn-secondary" onclick="window.print()">
          ${icon("Printer", { size: 16 })}
          <span>Imprimir Informe</span>
        </button>
      </div>

      <!-- Resumen Estadístico de Trazabilidad -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-box blue">
            ${icon("Package", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${state.orders.length}</span>
            <span class="kpi-label">Total Órdenes Históricas</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box emerald">
            ${icon("CheckCircle", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${formatNumber(totalKgProduced, 0)} kg</span>
            <span class="kpi-label">Producción Total Liberada</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box purple">
            ${icon("Scale", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">± ${avgDeviation}%</span>
            <span class="kpi-label">Desviación Media de Dosificación</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box amber">
            ${icon("ShieldAlert", { size: 24 })}
          </div>
          <div class="kpi-content">
            <span class="kpi-value">${state.orders.reduce((sum, o) => sum + (o.incidents?.length || 0), 0)}</span>
            <span class="kpi-label">Total Incidencias Registradas</span>
          </div>
        </div>
      </div>

      <!-- Filtros de Informe -->
      <div class="card">
        <div class="card-body" style="padding: 1rem 1.25rem;">
          <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Filtrar Producto:</span>
              <select id="report-filter-product" class="form-control" style="width:auto; height:36px; font-size:0.8rem;">
                <option value="all" ${reportProductFilter === "all" ? "selected" : ""}>Todos los Productos</option>
                ${state.products.map(
                  (p) => `<option value="${p.id}" ${reportProductFilter === p.id ? "selected" : ""}>${p.name}</option>`
                ).join("")}
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Estado:</span>
              <select id="report-filter-status" class="form-control" style="width:auto; height:36px; font-size:0.8rem;">
                <option value="all" ${reportStatusFilter === "all" ? "selected" : ""}>Todos los Estados</option>
                <option value="Completada" ${reportStatusFilter === "Completada" ? "selected" : ""}>Completada</option>
                <option value="En curso" ${reportStatusFilter === "En curso" ? "selected" : ""}>En curso</option>
                <option value="Con incidencias" ${reportStatusFilter === "Con incidencias" ? "selected" : ""}>Con incidencias</option>
                <option value="Programada" ${reportStatusFilter === "Programada" ? "selected" : ""}>Programada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla Comparativa Planificado vs Real -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            ${icon("FileText", { size: 19 })}
            <span>Comparativa de Lotes: Cantidades Planificadas vs Reales</span>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">
            ${filteredOrders.length} lote(s) en reporte
          </span>
        </div>

        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Lote / OF</th>
                <th>Fecha</th>
                <th>Producto Químico</th>
                <th>Lote Planificado</th>
                <th>Materia Prima Total Pesada</th>
                <th>Desv. Global</th>
                <th>Operario / Supervisor</th>
                <th>Estado</th>
                <th style="text-align: right;">Detalle</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredOrders.length === 0
                  ? `
                <tr>
                  <td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
                    No hay registros de producción con los filtros seleccionados.
                  </td>
                </tr>
              `
                  : filteredOrders
                      .map((o) => {
                        const badge = getStatusBadge(o.status);
                        const targetTotal = (o.components || []).reduce((acc, c) => acc + (c.targetQty || 0), 0);
                        const actualTotal = (o.components || []).reduce((acc, c) => acc + (c.actualQty || 0), 0);
                        const hasWeighedAll = o.components?.every((c) => c.isWeighed);
                        const devPct = targetTotal > 0 && hasWeighedAll ? ((actualTotal - targetTotal) / targetTotal) * 100 : null;

                        return `
                    <tr>
                      <td>
                        <strong class="font-mono" style="color:var(--color-primary);">${o.batchNumber}</strong><br>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${o.id}</span>
                      </td>
                      <td>
                        <span style="font-size:0.82rem;">${formatDate(o.scheduledDate)}</span>
                      </td>
                      <td>
                        <strong>${o.productName}</strong><br>
                        <span style="font-size:0.72rem; color:var(--text-muted);">Fórmula: ${o.recipeVersion}</span>
                      </td>
                      <td>
                        <span class="font-mono" style="font-weight:700;">${formatNumber(targetTotal, 1)} ${o.batchUnit}</span>
                      </td>
                      <td>
                        ${
                          hasWeighedAll
                            ? `<span class="font-mono" style="font-weight:700; color:#0284c7;">${formatNumber(actualTotal, 1)} ${o.batchUnit}</span>`
                            : `<span style="font-size:0.75rem; color:#d97706;">En proceso de carga</span>`
                        }
                      </td>
                      <td>
                        ${
                          devPct !== null
                            ? `<span class="font-mono" style="font-weight:700; color:${Math.abs(devPct) > 0.5 ? "#dc2626" : "#059669"};">
                              ${devPct >= 0 ? "+" : ""}${devPct.toFixed(2)}%
                            </span>`
                            : "—"
                        }
                      </td>
                      <td>
                        <span style="font-size:0.8rem; display:block;">Op: ${o.operatorAssigned}</span>
                        <span style="font-size:0.72rem; color:var(--text-muted);">Sup: ${o.supervisorAssigned || "—"}</span>
                      </td>
                      <td>
                        <span class="badge ${badge.bg}">
                          <span class="badge-dot" style="background-color: ${badge.dot ? badge.dot.replace('bg-', '') : 'currentColor'};"></span>
                          ${badge.text}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-secondary btn-sm" data-action="view-sheet" data-order-id="${o.id}">
                          ${icon("Eye", { size: 14 })}
                          <span>Ver Hoja</span>
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

export function bindReportsEvents(container) {
  const prodSelect = container.querySelector("#report-filter-product");
  if (prodSelect) {
    prodSelect.addEventListener("change", (e) => {
      reportProductFilter = e.target.value;
      store.notify();
    });
  }

  const statusSelect = container.querySelector("#report-filter-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      reportStatusFilter = e.target.value;
      store.notify();
    });
  }

  container.querySelectorAll("[data-action='view-sheet']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      store.navigate("execution", { orderId });
    });
  });
}
