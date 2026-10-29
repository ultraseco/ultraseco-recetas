// =========================================================================
// REGISTRO DE AUDITORÍA Y TRAZABILIDAD DE ACCIONES (AUDIT LOG)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatDateTime } from "../utils/formatters.js";

let auditActionFilter = "all";

export function renderAuditLog(state) {
  const query = (state.searchQuery || "").toLowerCase();

  const filteredLogs = state.auditLog.filter((log) => {
    const matchesAction = auditActionFilter === "all" || log.action === auditActionFilter;
    const matchesSearch =
      !query ||
      log.user.toLowerCase().includes(query) ||
      log.role.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.entity.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query);

    return matchesAction && matchesSearch;
  });

  const uniqueActions = Array.from(new Set(state.auditLog.map((l) => l.action)));

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Registro de Auditoría e Inmutabilidad</h1>
          <p>Trazabilidad cronológica de aprobaciones, cambios de versión, firmas de pesaje y eventos críticos</p>
        </div>
        <button class="btn btn-secondary" onclick="window.print()">
          ${icon("Printer", { size: 16 })}
          <span>Imprimir Registro</span>
        </button>
      </div>

      <!-- Filtros de Auditoría -->
      <div class="card">
        <div class="card-body" style="padding: 1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Filtrar por Acción:</span>
            <select id="audit-filter-action" class="form-control" style="width:auto; height:36px; font-size:0.8rem;">
              <option value="all" ${auditActionFilter === "all" ? "selected" : ""}>Todas las Acciones</option>
              ${uniqueActions.map(
                (act) => `<option value="${act}" ${auditActionFilter === act ? "selected" : ""}>${act}</option>`
              ).join("")}
            </select>
          </div>

          <span style="font-size:0.8rem; color:var(--text-muted);">
            Mostrando ${filteredLogs.length} eventos auditados
          </span>
        </div>
      </div>

      <!-- Tabla de Eventos de Auditoría -->
      <div class="card">
        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Rol / Permiso</th>
                <th>Acción Operativa</th>
                <th>Entidad / Objeto</th>
                <th>Detalles Técnicos y Justificación</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredLogs.length === 0
                  ? `
                <tr>
                  <td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
                    No se encontraron registros de auditoría para este criterio.
                  </td>
                </tr>
              `
                  : filteredLogs
                      .map((log) => {
                        let actionColor = "badge-neutral";
                        if (log.action.includes("Aprobación") || log.action.includes("Cierre")) actionColor = "badge-success";
                        if (log.action.includes("Incidencia") || log.action.includes("Paso Crítico")) actionColor = "badge-incident";
                        if (log.action.includes("Creación") || log.action.includes("Duplicación")) actionColor = "badge-in-progress";

                        return `
                    <tr>
                      <td class="font-mono" style="font-size:0.8rem; white-space:nowrap; color:var(--text-muted);">
                        ${log.timestamp}
                      </td>
                      <td>
                        <strong>${log.user}</strong>
                      </td>
                      <td>
                        <span style="font-size:0.75rem; color:#475569; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600;">
                          ${log.role}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${actionColor}">
                          ${log.action}
                        </span>
                      </td>
                      <td>
                        <strong class="font-mono" style="font-size:0.82rem; color:var(--color-primary);">${log.entity}</strong>
                      </td>
                      <td style="font-size:0.82rem; color:#334155; max-width:400px;">
                        ${log.details}
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

export function bindAuditLogEvents(container) {
  const actionSelect = container.querySelector("#audit-filter-action");
  if (actionSelect) {
    actionSelect.addEventListener("change", (e) => {
      auditActionFilter = e.target.value;
      store.notify();
    });
  }
}
