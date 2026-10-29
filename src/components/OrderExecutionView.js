// =========================================================================
// HOJA DE FABRICACIÓN INDUSTRIAL Y EJECUCIÓN EN PLANTA
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, formatDateTime, getStatusBadge } from "../utils/formatters.js";
import { showToast } from "./Toast.js";
import { DEMO_NOTICE, SAFETY_DISCLAIMER } from "../data/initialData.js";

export function renderOrderExecution(state) {
  const orderId = state.viewParams?.orderId || state.orders[0]?.id;
  const order = state.orders.find((o) => o.id === orderId) || state.orders[0];

  if (!order) {
    return `
      <div class="content-view">
        <div class="card" style="padding:3rem; text-align:center;">
          <p style="color:var(--text-muted);">No hay órdenes de fabricación registradas.</p>
          <button class="btn btn-primary" style="margin-top:1rem;" id="btn-back-orders">
            Volver a Órdenes
          </button>
        </div>
      </div>
    `;
  }

  const badge = getStatusBadge(order.status);
  const permissions = store.permissions;

  // Cálculos de completitud
  const totalComponents = order.components?.length || 0;
  const weighedComponents = order.components?.filter((c) => c.isWeighed).length || 0;
  const allWeighed = totalComponents > 0 && weighedComponents === totalComponents;

  const totalSteps = order.steps?.length || 0;
  const completedSteps = order.steps?.filter((s) => s.status === "Completado").length || 0;
  const allStepsCompleted = totalSteps > 0 && completedSteps === totalSteps;

  const criticalSteps = order.steps?.filter((s) => s.isCritical) || [];
  const unconfirmedCritical = criticalSteps.filter((s) => !s.criticalConfirmed);

  return `
    <div class="content-view">
      <!-- Sección Solo para Impresión Oficial -->
      <div class="print-only print-header">
        <div>
          <h2 style="font-size:16pt; font-weight:800; margin-bottom:2pt;">ULTRASECO — HOJA DE FABRICACIÓN Y CONTROL DE LOTE</h2>
          <p style="font-size:9pt; margin:0;">SISTEMA INDUSTRIAL DE TRAZABILIDAD QUÍMICA | [${DEMO_NOTICE}]</p>
        </div>
        <div style="text-align:right;">
          <strong style="font-size:14pt; font-family:monospace;">${order.batchNumber}</strong><br>
          <span style="font-size:9pt;">Orden: ${order.id} | Fecha: ${formatDate(order.scheduledDate)}</span>
        </div>
      </div>

      <!-- Barra de Navegación y Acciones Superiores -->
      <div class="view-header no-print">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <button class="btn btn-secondary btn-sm" id="btn-back-to-orders">
            ${icon("ArrowLeft", { size: 16 })}
            <span>Lista de Órdenes</span>
          </button>
          <div class="view-title-group">
            <h1>Hoja de Fabricación: <span class="font-mono">${order.batchNumber}</span></h1>
            <p>${order.productName} — Orden Oficial: <strong>${order.id}</strong></p>
          </div>
        </div>

        <div style="display:flex; gap:0.75rem; flex-wrap: wrap;">
          <!-- Selector rápido de otra orden -->
          <select id="select-change-order" class="form-control" style="width: auto; height: 38px; font-size: 0.8rem;">
            ${state.orders.map(
              (o) => `
              <option value="${o.id}" ${o.id === order.id ? "selected" : ""}>
                ${o.id} - ${o.batchNumber} (${o.status})
              </option>
            `
            ).join("")}
          </select>

          <button class="btn btn-secondary btn-sm" id="btn-print-sheet">
            ${icon("Printer", { size: 16 })}
            <span>Imprimir Hoja de Planta</span>
          </button>

          <button class="btn btn-warning btn-sm" id="btn-log-incident">
            ${icon("AlertTriangle", { size: 16 })}
            <span>Registrar Incidencia</span>
          </button>

          ${
            order.status !== "Completada"
              ? `
            <button class="btn btn-success btn-sm" id="btn-complete-order">
              ${icon("CheckCheck", { size: 16 })}
              <span>Finalizar y Liberar Lote</span>
            </button>
          `
              : `
            <span class="badge badge-success" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              ${icon("CheckCircle", { size: 16, className: "inline" })} Lote Cerrado y Liberado
            </span>
          `
          }
        </div>
      </div>

      <!-- Banner de Advertencia Demo -->
      <div class="safety-alert-banner">
        <div style="flex-shrink:0;">${icon("AlertTriangle", { size: 22 })}</div>
        <div>
          <strong>${DEMO_NOTICE}</strong>: ${SAFETY_DISCLAIMER}
        </div>
      </div>

      <!-- Tarjeta de Metadatos del Lote Industrial -->
      <div class="batch-execution-header">
        <div class="execution-stat-box">
          <span class="execution-stat-label">Producto Químico</span>
          <span class="execution-stat-value" style="font-size:1.05rem;">${order.productName}</span>
          <span style="font-size:0.75rem; color:#94a3b8;">Fórmula Aprobada: ${order.recipeVersion}</span>
        </div>

        <div class="execution-stat-box">
          <span class="execution-stat-label">Tamaño del Lote</span>
          <span class="execution-stat-value" style="color:#38bdf8;">${formatNumber(order.batchSize, 1)} ${order.batchUnit}</span>
          <span style="font-size:0.75rem; color:#94a3b8;">Factor de Escala: ${order.scaleFactor}x</span>
        </div>

        <div class="execution-stat-box">
          <span class="execution-stat-label">Reactor / Mezclador</span>
          <span class="execution-stat-value" style="font-size:1rem;">${order.targetReactor}</span>
          <span style="font-size:0.75rem; color:#94a3b8;">Fecha: ${formatDate(order.scheduledDate)}</span>
        </div>

        <div class="execution-stat-box">
          <span class="execution-stat-label">Personal Responsable</span>
          <span class="execution-stat-value" style="font-size:0.95rem;">Op: ${order.operatorAssigned}</span>
          <span style="font-size:0.75rem; color:#94a3b8;">Sup: ${order.supervisorAssigned || "No asignado"}</span>
        </div>

        <div class="execution-stat-box">
          <span class="execution-stat-label">Estado de la Orden</span>
          <span class="execution-stat-value" style="margin-top:0.35rem;">
            <span class="badge ${badge.bg}" style="font-size:0.8rem;">
              <span class="badge-dot" style="background-color: ${badge.dot ? badge.dot.replace('bg-', '') : 'currentColor'};"></span>
              ${badge.text}
            </span>
          </span>
          <span style="font-size:0.75rem; color:#94a3b8;">
            Inicio: ${order.startTime ? formatDateTime(order.startTime) : "Pendiente"}
          </span>
        </div>
      </div>

      <!-- Incidencias Registradas si existen -->
      ${
        order.incidents && order.incidents.length > 0
          ? `
        <div class="card" style="border-left: 5px solid #dc2626; margin-bottom: 1.5rem;">
          <div class="card-header" style="background-color: #fef2f2;">
            <div class="card-title" style="color: #991b1b;">
              ${icon("AlertCircle", { size: 19 })}
              <span>Incidencias y Desviaciones Registradas en este Lote (${order.incidents.length})</span>
            </div>
          </div>
          <div class="card-body" style="padding: 0;">
            <table class="industrial-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Severidad</th>
                  <th>Tipo</th>
                  <th>Descripción de la Desviación</th>
                  <th>Reportado Por</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${order.incidents
                  .map(
                    (inc) => `
                  <tr>
                    <td class="font-mono" style="font-size:0.8rem;">${formatDateTime(inc.timestamp)}</td>
                    <td>
                      <span class="badge ${inc.severity === "Alta" ? "badge-incident" : "badge-pending"}">
                        ${inc.severity}
                      </span>
                    </td>
                    <td><strong>${inc.type}</strong></td>
                    <td style="font-size:0.85rem;">
                      ${inc.description}
                      ${inc.actionPlan ? `<div style="font-size:0.78rem; color:#0369a1; margin-top:2px;"><strong>Plan correctivo:</strong> ${inc.actionPlan}</div>` : ""}
                    </td>
                    <td>${inc.reportedBy}</td>
                    <td>
                      <span style="color:${inc.resolved ? "#059669" : "#dc2626"}; font-weight:700; font-size:0.78rem;">
                        ${inc.resolved ? "✓ Resuelta" : "⚠ En observación"}
                      </span>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `
          : ""
      }

      <!-- SECCIÓN 1: DOSIFICACIÓN Y PESAJE DE COMPONENTES -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            ${icon("Scale", { size: 19 })}
            <span>1. Registro de Pesaje y Dosificación de Materias Primas</span>
          </div>
          <div style="font-size:0.82rem; font-weight:600; color: ${allWeighed ? "#059669" : "#d97706"};">
            ${allWeighed ? "✓ Todos los componentes pesados" : `Faltan pesadas (${weighedComponents}/${totalComponents})`}
          </div>
        </div>

        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Código MP</th>
                <th>Materia Prima</th>
                <th>Cant. Requerida</th>
                <th>Cant. Real Pesada</th>
                <th>Desviación %</th>
                <th>Lote Materia Prima (Trazabilidad)</th>
                <th>Operario / Firma</th>
                <th class="no-print" style="text-align: right;">Acción</th>
              </tr>
            </thead>
            <tbody>
              ${(order.components || [])
                .map((comp) => {
                  const isWeighed = comp.isWeighed;
                  const dev = comp.deviationPct;
                  let devClass = "color: #059669;"; // green
                  if (Math.abs(dev || 0) > 1.0) devClass = "color: #dc2626; font-weight:700;";
                  else if (Math.abs(dev || 0) > 0.3) devClass = "color: #d97706; font-weight:600;";

                  return `
                  <tr style="${!isWeighed ? "background-color: #fffbeb;" : ""}">
                    <td>
                      <span class="code-pill font-mono" style="font-size:0.75rem; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700;">
                        ${comp.code}
                      </span>
                    </td>
                    <td>
                      <strong>${comp.name}</strong>
                    </td>
                    <td>
                      <span class="font-mono" style="font-size:0.95rem; font-weight:700; color:#0f172a;">
                        ${formatNumber(comp.targetQty, 2)} ${comp.unit}
                      </span>
                    </td>
                    <td>
                      ${
                        isWeighed
                          ? `<span class="font-mono" style="font-size:0.95rem; font-weight:700; color:#0284c7;">${formatNumber(comp.actualQty, 2)} ${comp.unit}</span>`
                          : `<span style="color:#d97706; font-size:0.8rem; font-weight:600;">[Pendiente de Pesaje]</span>`
                      }
                    </td>
                    <td>
                      ${
                        isWeighed && dev !== null
                          ? `<span class="font-mono" style="${devClass}">${dev >= 0 ? "+" : ""}${dev.toFixed(2)}%</span>`
                          : "—"
                      }
                    </td>
                    <td>
                      <span class="font-mono" style="font-size:0.78rem;">
                        ${comp.rawMaterialLot || "—"}
                      </span>
                    </td>
                    <td>
                      <span style="font-size:0.8rem;">
                        ${comp.weighedBy ? `✓ ${comp.weighedBy}` : "—"}
                      </span>
                    </td>
                    <td class="no-print" style="text-align: right;">
                      <button 
                        class="btn ${isWeighed ? "btn-secondary" : "btn-primary"} btn-sm" 
                        data-action="record-tare" 
                        data-order-id="${order.id}" 
                        data-comp-id="${comp.id}"
                      >
                        ${icon("Edit3", { size: 14 })}
                        <span>${isWeighed ? "Modificar" : "Pesar"}</span>
                      </button>
                    </td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECCIÓN 2: ETAPAS DE FABRICACIÓN PASO A PASO -->
      <div style="margin-top: 2rem; margin-bottom: 1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a;">2. Instrucciones de Fabricación Paso a Paso</h2>
          <p style="font-size:0.85rem; color:var(--text-muted);">Siga rigurosamente las rampas de velocidad, temperaturas y advertencias críticas de planta</p>
        </div>
        <div style="font-size:0.85rem; font-weight:600; color: ${allStepsCompleted ? "#059669" : "#0284c7"};">
          Progreso: ${completedSteps} de ${totalSteps} etapas finalizadas
        </div>
      </div>

      <div class="steps-container">
        ${(order.steps || [])
          .map((step) => {
            const isCompleted = step.status === "Completado";
            const isInProgress = step.status === "En curso";
            const isCritical = step.isCritical;
            const criticalConfirmed = step.criticalConfirmed;

            return `
            <div class="step-card ${isCompleted ? "completed" : ""} ${isInProgress ? "active-step" : ""} ${isCritical ? "critical-step" : ""}">
              <div class="step-header">
                <div style="display:flex; align-items:center;">
                  <div class="step-number-circle">
                    ${isCompleted ? icon("Check", { size: 16 }) : step.stepNum}
                  </div>
                  <div>
                    <h3 style="font-size:1rem; font-weight:700; color:#0f172a; margin:0;">
                      Etapa ${step.stepNum}: ${step.title}
                    </h3>
                    <span style="font-size:0.75rem; color:var(--text-muted);">
                      Equipo: <strong>${step.equipment || order.targetReactor}</strong> | Duración est.: <strong>${step.estDurationMin} min</strong>
                    </span>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:0.5rem;">
                  ${
                    isCritical
                      ? `
                    <span class="badge ${criticalConfirmed ? "badge-success" : "badge-incident"}" style="font-size:0.72rem;">
                      ${icon("AlertTriangle", { size: 13, className: "inline" })}
                      ${criticalConfirmed ? "Paso Crítico Confirmado" : "CRÍTICO: Requiere Aprobación"}
                    </span>
                  `
                      : ""
                  }
                  <span class="badge ${isCompleted ? "badge-success" : isInProgress ? "badge-in-progress" : "badge-neutral"}">
                    ${step.status}
                  </span>
                </div>
              </div>

              <div class="step-body">
                <div class="step-instruction">
                  ${step.instruction}
                </div>

                ${
                  isCritical && step.criticalWarning
                    ? `
                  <div class="critical-warning-box">
                    <div style="flex-shrink:0;">${icon("AlertTriangle", { size: 20 })}</div>
                    <div>
                      <strong>PROTOCOLO DE SEGURIDAD INDUSTRIAL:</strong><br>
                      ${step.criticalWarning}
                    </div>
                  </div>
                `
                    : ""
                }

                <!-- Parámetros Teóricos vs Reales Medidos -->
                <div class="step-params-grid">
                  <div>
                    <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block;">
                      Temperatura Objetivo
                    </span>
                    <strong class="font-mono">${step.tempTarget || "Ambiente"}</strong>
                    <div style="font-size:0.78rem; margin-top:2px;">
                      Real medido: <strong style="color:#0284c7;">${step.actualTemp || "—"}</strong>
                    </div>
                  </div>

                  <div>
                    <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block;">
                      Velocidad Agitación
                    </span>
                    <strong class="font-mono">${step.rpmTarget ? `${step.rpmTarget} RPM` : "N/A"}</strong>
                    <div style="font-size:0.78rem; margin-top:2px;">
                      Real medido: <strong style="color:#0284c7;">${step.actualRpm ? `${step.actualRpm} RPM` : "—"}</strong>
                    </div>
                  </div>

                  <div>
                    <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block;">
                      Tiempos de Ejecución
                    </span>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">
                      Inicio: <strong>${step.startedAt ? formatDateTime(step.startedAt) : "—"}</strong>
                    </span>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">
                      Fin: <strong>${step.completedAt ? formatDateTime(step.completedAt) : "—"}</strong>
                    </span>
                  </div>

                  <div>
                    <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block;">
                      Verificación Operario
                    </span>
                    <span style="font-size:0.78rem; color:#1e293b;">
                      ${step.verifiedBy ? `✓ ${step.verifiedBy}` : "Pendiente de firma"}
                    </span>
                  </div>
                </div>

                ${
                  step.operatorNote
                    ? `
                  <div style="background-color:#f1f5f9; padding:0.5rem 0.75rem; border-radius:var(--radius-sm); font-size:0.8rem; color:#334155; margin-bottom:1rem;">
                    <strong>Observación de planta:</strong> ${step.operatorNote}
                  </div>
                `
                    : ""
                }

                <!-- Acciones de la Etapa -->
                <div class="no-print" style="display:flex; justify-content:flex-end; gap:0.5rem; flex-wrap:wrap; border-top:1px solid var(--border-light); padding-top:0.85rem; margin-top:0.5rem;">
                  ${
                    !isCompleted && !isInProgress
                      ? `
                    <button class="btn btn-primary btn-sm" data-action="start-step" data-order-id="${order.id}" data-step-num="${step.stepNum}">
                      ${icon("Play", { size: 14 })}
                      <span>Iniciar Esta Etapa</span>
                    </button>
                  `
                      : ""
                  }

                  ${
                    isCritical && !criticalConfirmed
                      ? `
                    <button class="btn btn-danger btn-sm" data-action="confirm-critical" data-order-id="${order.id}" data-step-num="${step.stepNum}">
                      ${icon("ShieldAlert", { size: 14 })}
                      <span>Autorizar Paso Crítico</span>
                    </button>
                  `
                      : ""
                  }

                  ${
                    isInProgress
                      ? `
                    <button 
                      class="btn btn-success btn-sm" 
                      data-action="finish-step-modal" 
                      data-order-id="${order.id}" 
                      data-step-num="${step.stepNum}"
                      ${isCritical && !criticalConfirmed ? "disabled title='Debe confirmar el paso crítico antes de finalizar'" : ""}
                    >
                      ${icon("Check", { size: 14 })}
                      <span>Registrar Parámetros y Finalizar Etapa</span>
                    </button>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>

      <!-- Sección de Firmas para Impresión en Papel -->
      <div class="print-only" style="margin-top: 30pt; page-break-inside: avoid;">
        <h4 style="font-size:11pt; border-bottom: 1px solid #000; padding-bottom: 4pt; margin-bottom: 20pt;">
          CIERRE FORMAL DE LOTE Y LIBERACIÓN DE CALIDAD
        </h4>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 20pt; text-align: center;">
          <div style="border-top: 1px solid #000; padding-top: 5pt;">
            <strong>Operario Responsable</strong><br>
            <span style="font-size:9pt;">${order.operatorAssigned}</span><br>
            <span style="font-size:8pt; color:#666;">Firma y Fecha</span>
          </div>
          <div style="border-top: 1px solid #000; padding-top: 5pt;">
            <strong>Supervisor de Turno</strong><br>
            <span style="font-size:9pt;">${order.supervisorAssigned || "Supervisor de Planta"}</span><br>
            <span style="font-size:8pt; color:#666;">Firma y Fecha</span>
          </div>
          <div style="border-top: 1px solid #000; padding-top: 5pt;">
            <strong>Control de Calidad / I+D</strong><br>
            <span style="font-size:9pt;">Dra. Elena Valdés</span><br>
            <span style="font-size:8pt; color:#666;">Dictamen: Liberado [   ] Retenido [   ]</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindOrderExecutionEvents(container) {
  const btnBack = container.querySelector("#btn-back-to-orders");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      store.navigate("orders");
    });
  }

  const btnPrint = container.querySelector("#btn-print-sheet");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  const selectOrder = container.querySelector("#select-change-order");
  if (selectOrder) {
    selectOrder.addEventListener("change", (e) => {
      store.navigate("execution", { orderId: e.target.value });
    });
  }

  const btnLogIncident = container.querySelector("#btn-log-incident");
  if (btnLogIncident) {
    btnLogIncident.addEventListener("click", () => {
      const orderId = store.state.viewParams?.orderId || store.state.orders[0]?.id;
      store.openModal("incidentModal", { orderId });
    });
  }

  const btnCompleteOrder = container.querySelector("#btn-complete-order");
  if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener("click", () => {
      const orderId = store.state.viewParams?.orderId || store.state.orders[0]?.id;
      try {
        store.completeOrder(orderId);
        showToast("Lote finalizado y liberado exitosamente.", "success");
      } catch (err) {
        showToast(err.message, "error", 6000);
      }
    });
  }

  // Pesaje de materia prima
  container.querySelectorAll("[data-action='record-tare']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      const compId = btn.getAttribute("data-comp-id");
      store.openModal("tareModal", { orderId, compId });
    });
  });

  // Iniciar etapa
  container.querySelectorAll("[data-action='start-step']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      const stepNum = parseInt(btn.getAttribute("data-step-num"), 10);
      store.startOrderStep(orderId, stepNum);
      showToast(`Etapa ${stepNum} iniciada`, "info");
    });
  });

  // Confirmar paso crítico
  container.querySelectorAll("[data-action='confirm-critical']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      const stepNum = parseInt(btn.getAttribute("data-step-num"), 10);
      store.openModal("criticalConfirmModal", { orderId, stepNum });
    });
  });

  // Registrar parámetros y finalizar etapa
  container.querySelectorAll("[data-action='finish-step-modal']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      const stepNum = parseInt(btn.getAttribute("data-step-num"), 10);
      store.openModal("finishStepModal", { orderId, stepNum });
    });
  });
}
