// =========================================================================
// GESTIÓN DE ÓRDENES DE FABRICACIÓN (ORDERS LIST)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, getStatusBadge } from "../utils/formatters.js";

let selectedOrderFilter = "all";

export function renderOrders(state) {
  const query = (state.searchQuery || "").toLowerCase();
  const permissions = store.permissions;

  const filteredOrders = state.orders.filter((o) => {
    const matchesFilter =
      selectedOrderFilter === "all" ||
      (selectedOrderFilter === "activas" && (o.status === "Programada" || o.status === "En curso" || o.status === "Con incidencias")) ||
      (selectedOrderFilter === "completadas" && o.status === "Completada") ||
      (selectedOrderFilter === "incidencias" && o.status === "Con incidencias");

    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.batchNumber.toLowerCase().includes(query) ||
      o.productName.toLowerCase().includes(query) ||
      (o.operatorAssigned && o.operatorAssigned.toLowerCase().includes(query)) ||
      (o.targetReactor && o.targetReactor.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Órdenes de Fabricación Químicas (OF)</h1>
          <p>Control de programación, asignación de reactores y seguimiento operativo de lotes</p>
        </div>
        <div>
          <button class="btn btn-primary" id="btn-create-order" ${!permissions.canCreateOrder ? "disabled title='Requiere permisos de supervisor o admin'" : ""}>
            ${icon("Plus", { size: 17 })}
            <span>Nueva Orden de Fabricación</span>
          </button>
        </div>
      </div>

      <!-- Filtros Rápidos -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-sm ${selectedOrderFilter === "all" ? "btn-primary" : "btn-secondary"}" data-order-filter="all">
            Todas (${state.orders.length})
          </button>
          <button class="btn btn-sm ${selectedOrderFilter === "activas" ? "btn-primary" : "btn-secondary"}" data-order-filter="activas">
            Activas en Planta (${state.orders.filter((o) => o.status !== "Completada").length})
          </button>
          <button class="btn btn-sm ${selectedOrderFilter === "completadas" ? "btn-primary" : "btn-secondary"}" data-order-filter="completadas">
            Completadas (${state.orders.filter((o) => o.status === "Completada").length})
          </button>
          <button class="btn btn-sm ${selectedOrderFilter === "incidencias" ? "btn-primary" : "btn-secondary"}" data-order-filter="incidencias">
            Con Incidencias (${state.orders.filter((o) => o.status === "Con incidencias").length})
          </button>
        </div>

        <span style="font-size:0.8rem; color:var(--text-muted);">
          Mostrando ${filteredOrders.length} orden(es) de fabricación
        </span>
      </div>

      <!-- Tabla de Órdenes -->
      <div class="card">
        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Código de Lote</th>
                <th>Producto Químico</th>
                <th>Fórmula Aprobada</th>
                <th>Tamaño Lote</th>
                <th>Reactor Asignado</th>
                <th>Operario / Supervisor</th>
                <th>Estado</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredOrders.length === 0
                  ? `
                <tr>
                  <td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
                    No se encontraron órdenes registradas con este filtro.
                  </td>
                </tr>
              `
                  : filteredOrders
                      .map((order) => {
                        const badge = getStatusBadge(order.status);
                        const weighedCount = order.components?.filter((c) => c.isWeighed).length || 0;
                        const totalComponents = order.components?.length || 0;
                        const completedSteps = order.steps?.filter((s) => s.status === "Completado").length || 0;
                        const totalSteps = order.steps?.length || 0;

                        return `
                    <tr>
                      <td>
                        <strong style="color:var(--color-primary);">${order.id}</strong><br>
                        <span style="font-size:0.72rem; color:var(--text-muted);">${formatDate(order.scheduledDate)}</span>
                      </td>
                      <td>
                        <span class="code-pill font-mono" style="font-weight:700; color:#0f172a;">${order.batchNumber}</span>
                      </td>
                      <td>
                        <strong>${order.productName}</strong>
                      </td>
                      <td>
                        <span class="font-mono" style="font-size:0.8rem;">${order.recipeVersion}</span>
                      </td>
                      <td>
                        <span class="font-mono" style="font-weight:700;">${formatNumber(order.batchSize, 1)} ${order.batchUnit}</span><br>
                        <span style="font-size:0.72rem; color:var(--text-muted);">(Factor ${order.scaleFactor}x)</span>
                      </td>
                      <td>
                        <span style="font-size:0.82rem; font-weight:600;">${order.targetReactor}</span>
                      </td>
                      <td>
                        <span style="font-size:0.82rem; display:block;">Op: <strong>${order.operatorAssigned}</strong></span>
                        <span style="font-size:0.72rem; color:var(--text-muted);">Sup: ${order.supervisorAssigned || "—"}</span>
                      </td>
                      <td>
                        <span class="badge ${badge.bg}">
                          <span class="badge-dot" style="background-color: ${badge.dot ? badge.dot.replace('bg-', '') : 'currentColor'};"></span>
                          ${badge.text}
                        </span>
                        <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                          Pesadas: ${weighedCount}/${totalComponents} | Pasos: ${completedSteps}/${totalSteps}
                        </div>
                      </td>
                      <td style="text-align: right; white-space:nowrap;">
                        <button class="btn btn-primary btn-sm" data-action="open-order" data-order-id="${order.id}">
                          ${icon("Activity", { size: 14 })}
                          <span>Hoja de Fabricación</span>
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

export function bindOrdersEvents(container) {
  container.querySelectorAll("[data-order-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedOrderFilter = btn.getAttribute("data-order-filter");
      store.notify();
    });
  });

  const btnCreateOrder = container.querySelector("#btn-create-order");
  if (btnCreateOrder) {
    btnCreateOrder.addEventListener("click", () => {
      store.openModal("createOrder");
    });
  }

  container.querySelectorAll("[data-action='open-order']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      store.navigate("execution", { orderId });
    });
  });
}
