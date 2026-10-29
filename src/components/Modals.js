// =========================================================================
// SISTEMA DE MODALES INTERACTIVOS INDUSTRIALES
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, formatDateTime, getStatusBadge } from "../utils/formatters.js";
import { DEMO_NOTICE, SAFETY_DISCLAIMER } from "../data/initialData.js";
import { showToast } from "./Toast.js";

export function renderModals(state) {
  const modal = state.activeModal;
  const data = state.modalData;

  if (!modal) return "";

  switch (modal) {
    case "safetyModal":
      return renderSafetyModal();
    case "recipeDetail":
      return renderRecipeDetailModal(state, data);
    case "recipeEditor":
      return renderRecipeEditorModal(state);
    case "duplicateRecipe":
      return renderDuplicateModal(state, data);
    case "approveRecipe":
      return renderApproveModal(state, data);
    case "createOrder":
      return renderCreateOrderModal(state, data);
    case "tareModal":
      return renderTareModal(state, data);
    case "criticalConfirmModal":
      return renderCriticalConfirmModal(state, data);
    case "finishStepModal":
      return renderFinishStepModal(state, data);
    case "incidentModal":
      return renderIncidentModal(state, data);
    default:
      return "";
  }
}

// 1. Modal de Seguridad y Procedimientos Aprobados
function renderSafetyModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title" style="color:#991b1b;">
            ${icon("ShieldAlert", { size: 22 })}
            <span>Marco de Seguridad Operacional y Validación Técnica</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="safety-alert-banner" style="margin-bottom:1.25rem;">
            <div>
              <strong>${DEMO_NOTICE}</strong><br>
              ${SAFETY_DISCLAIMER}
            </div>
          </div>

          <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem;">
            Protocolos Obligatorios para Personal de Planta:
          </h4>
          <ul style="font-size:0.86rem; color:#334155; line-height:1.6; padding-left:1.25rem; margin-bottom:1.25rem;">
            <li><strong>Fichas de Datos de Seguridad (FDS / MSDS):</strong> Antes de manipular materias primas químicas (polímeros, silanos, biocidas o dispersiones nanométricas), consulte siempre la FDS vigente en la estación de pesaje.</li>
            <li><strong>Aprobación de Recetas:</strong> Ningún lote puede ser producido comercialmente si la receta no cuenta con la aprobación electrónica formal de la Dirección Técnica o de I+D.</li>
            <li><strong>Conversión Masa / Volumen:</strong> No asumir que 1 kg equivale a 1 L. Siempre debe verificarse la densidad específica aprobada a 20°C.</li>
            <li><strong>Pasos Críticos de Proceso:</strong> Los pasos identificados con advertencia roja requieren verificación doble e ingreso de observaciones de seguridad antes de continuar.</li>
            <li><strong>Trazabilidad de Insumos:</strong> Registre invariablemente el número de lote de materia prima en la hoja de fabricación para auditorías posteriores.</li>
          </ul>

          <div style="background-color:#f8fafc; border:1px solid var(--border-light); padding:0.85rem; border-radius:var(--radius-md); font-size:0.8rem; color:var(--text-muted);">
            <em>Cualquier desviación imprevista de temperatura, viscosidad, exoterma o tiempo de agitación debe registrarse de inmediato mediante la opción "Registrar Incidencia".</em>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary modal-close-btn">Entendido</button>
        </div>
      </div>
    </div>
  `;
}

// 2. Modal Detalle de Receta Completa
function renderRecipeDetailModal(state, data) {
  const recipe = state.recipes.find((r) => r.id === data?.recipeId);
  if (!recipe) return "";

  const badge = getStatusBadge(recipe.status);
  const totalPercentage = (recipe.components || []).reduce((acc, c) => acc + (c.percentage || 0), 0);
  const totalBaseQty = (recipe.components || []).reduce((acc, c) => acc + (c.baseQty || 0), 0);

  return `
    <div class="modal-overlay">
      <div class="modal-dialog large">
        <div class="modal-header">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="code-pill font-mono" style="font-weight:700; color:var(--color-primary);">${recipe.recipeCode} (${recipe.version})</span>
              <span class="badge ${badge.bg}">${badge.text}</span>
              ${recipe.isApprovedVersion ? `<span style="color:#059669; font-size:0.75rem; font-weight:700;">● VERSIÓN VIGENTE HOMOLOGADA</span>` : ""}
            </div>
            <h2 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin-top:0.25rem;">${recipe.title}</h2>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>

        <div class="modal-body">
          <!-- Metadatos de la Receta -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; background:#f8fafc; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light); margin-bottom:1.25rem; font-size:0.82rem;">
            <div>
              <span style="color:var(--text-muted); display:block;">Producto Asociado:</span>
              <strong>${recipe.productName}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Lote Base Homologado:</span>
              <strong class="font-mono">${formatNumber(recipe.baseBatchSize, 0)} ${recipe.baseUnit}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Rango Operacional Reactor:</span>
              <strong class="font-mono">${formatNumber(recipe.minBatchSize, 0)} - ${formatNumber(recipe.maxBatchSize, 0)} ${recipe.baseUnit}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Densidad Teórica:</span>
              <strong class="font-mono">${formatNumber(recipe.densityRef, 3)} kg/L</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Autor Técnico:</span>
              <strong>${recipe.author || "—"}</strong> (${formatDate(recipe.createdAt)})
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Aprobación Técnica:</span>
              <strong>${recipe.approvedBy ? `${recipe.approvedBy} (${formatDate(recipe.approvedDate)})` : "Pendiente"}</strong>
            </div>
          </div>

          ${
            recipe.approvalNotes
              ? `
            <div style="background-color:#ecfdf5; border:1px solid #a7f3d0; border-radius:var(--radius-md); padding:0.75rem 1rem; margin-bottom:1.25rem; font-size:0.82rem; color:#065f46;">
              <strong>Dictamen de Aprobación Técnica:</strong> ${recipe.approvalNotes}
            </div>
          `
              : ""
          }

          <!-- Tabla de Componentes -->
          <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
            <span>Materias Primas & Balance de Masa</span>
            <span style="font-size:0.78rem; font-weight:600; color:${Math.abs(totalPercentage - 100) < 0.1 ? "#059669" : "#d97706"};">
              Suma: ${totalPercentage.toFixed(1)}% | Masa base: ${formatNumber(totalBaseQty, 1)} ${recipe.baseUnit}
            </span>
          </h4>

          <div class="table-responsive" style="margin-bottom:1.5rem;">
            <table class="industrial-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Materia Prima</th>
                  <th>Cantidad Base</th>
                  <th>Concentración / %</th>
                  <th>Densidad</th>
                  <th>Notas de Manejo y Seguridad</th>
                </tr>
              </thead>
              <tbody>
                ${(recipe.components || []).map((comp) => `
                  <tr>
                    <td><span class="code-pill font-mono" style="font-size:0.75rem; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700;">${comp.code}</span></td>
                    <td><strong>${comp.name}</strong></td>
                    <td class="font-mono">${formatNumber(comp.baseQty, 2)} ${comp.unit}</td>
                    <td class="font-mono">${comp.percentage ? comp.percentage.toFixed(1) : "—"}%</td>
                    <td class="font-mono" style="font-size:0.78rem;">${comp.density ? `${comp.density.toFixed(3)} kg/L` : "—"}</td>
                    <td style="font-size:0.78rem; color:#475569;">${comp.handlingNotes || "—"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- Etapas de Proceso -->
          <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem;">
            Procedimiento Operativo Paso a Paso (${recipe.steps?.length || 0} etapas)
          </h4>

          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            ${(recipe.steps || []).map((step) => `
              <div style="background:#ffffff; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.85rem; ${step.isCritical ? "border-left: 5px solid #dc2626;" : ""}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                  <strong style="font-size:0.9rem; color:#0f172a;">
                    Etapa ${step.stepNum}: ${step.title}
                  </strong>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    ${step.isCritical ? `<span class="badge badge-incident" style="font-size:0.7rem;">PASO CRÍTICO</span>` : ""}
                    <span style="font-size:0.75rem; color:var(--text-muted);">${step.estDurationMin} min</span>
                  </div>
                </div>
                <p style="font-size:0.84rem; color:#334155; margin-bottom:0.35rem;">${step.instruction}</p>
                <div style="font-size:0.75rem; color:var(--text-muted); display:flex; gap:1rem;">
                  <span>T° Obj: <strong>${step.tempTarget || "Ambiente"}</strong></span>
                  <span>Agitación: <strong>${step.rpmTarget ? `${step.rpmTarget} RPM` : "N/A"}</strong></span>
                  <span>Equipo: <strong>${step.equipment || "Reactor"}</strong></span>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Historial de Versiones -->
          <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem;">
            Historial de Versiones y Cambios Aprobados
          </h4>
          <div style="background:#f8fafc; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.75rem; font-size:0.8rem;">
            ${(recipe.history || []).map((h) => `
              <div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid #e2e8f0;">
                <div>
                  <strong class="font-mono">${h.version}</strong> — <span class="badge ${getStatusBadge(h.status).bg}" style="font-size:0.68rem;">${h.status}</span>
                  <div style="color:var(--text-muted);">${h.notes}</div>
                </div>
                <div style="text-align:right; color:var(--text-muted); font-size:0.72rem;">
                  ${h.author} | ${formatDate(h.date)}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cerrar</button>
          <button class="btn btn-primary" id="btn-modal-calc-batch" data-recipe-id="${recipe.id}">
            ${icon("Scale", { size: 16 })}
            <span>Calcular Lote con esta Receta</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 3. Modal de Duplicación de Receta para Proponer Nueva Versión
function renderDuplicateModal(state, data) {
  const recipe = state.recipes.find((r) => r.id === data?.recipeId);
  if (!recipe) return "";

  // Sugerir siguiente versión (ej. de v1.2 a v1.3-propuesta)
  const nextVer = `${recipe.version}.1-borrador`;

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            ${icon("Copy", { size: 20 })}
            <span>Duplicar Receta para Proponer Nueva Versión</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:0.75rem 1rem; margin-bottom:1.25rem; font-size:0.82rem; color:#1e40af;">
            <strong>Integridad de Fórmulas:</strong> La receta actual <strong>${recipe.recipeCode} (${recipe.version})</strong> permanecerá intacta e inalterada en producción. Se creará una propuesta en borrador que requerirá aprobación técnica explícita.
          </div>

          <div class="form-group">
            <label class="form-label">Identificador de la Nueva Versión:</label>
            <input type="text" id="dup-version-label" class="form-control font-mono" value="${nextVer}" required />
            <span class="form-hint">Ejemplo: v1.3, v2.0-ensayo, etc.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Motivo Técnico del Cambio o Justificación de I+D:</label>
            <textarea id="dup-reason" class="form-control" rows="3" placeholder="Explique por qué se propone esta nueva versión (ej. sustitución de materia prima, reducción de tiempo, ajuste de viscosidad...)" required></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-primary" id="btn-confirm-duplicate" data-recipe-id="${recipe.id}">
            Crear Propuesta Borrador
          </button>
        </div>
      </div>
    </div>
  `;
}

// 4. Modal de Aprobación Formal de Receta
function renderApproveModal(state, data) {
  const recipe = state.recipes.find((r) => r.id === data?.recipeId);
  if (!recipe) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title" style="color:#059669;">
            ${icon("ShieldCheck", { size: 22 })}
            <span>Aprobación Técnica Oficial de Receta</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="safety-alert-banner" style="background:#ecfdf5; border-color:#a7f3d0; border-left-color:#059669; color:#065f46;">
            <div>
              <strong>Responsabilidad Técnica:</strong> Al aprobar esta receta, usted certifica que la fórmula <strong>${recipe.recipeCode} (${recipe.version})</strong> ha sido validada y está autorizada para fabricación industrial en planta.
            </div>
          </div>

          <div style="background:#f8fafc; padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-light); margin-bottom:1.25rem; font-size:0.82rem;">
            <div>Usuario Aprobador: <strong>${state.currentUser.name}</strong></div>
            <div>Rol Autorizado: <strong>${state.currentUser.roleLabel}</strong></div>
            <div>Fecha: <strong>${new Date().toISOString().split("T")[0]}</strong></div>
          </div>

          <div class="form-group">
            <label class="form-label">Dictamen Técnico y Notas de Aprobación:</label>
            <textarea id="approve-notes" class="form-control" rows="3" placeholder="Indique ensayos piloto realizados, conformidad con especificaciones o autorización de la jefatura técnica..." required>Validada conforme a especificaciones técnicas y tolerancias de planta.</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-success" id="btn-confirm-approve" data-recipe-id="${recipe.id}">
            Confirmar Aprobación Oficial
          </button>
        </div>
      </div>
    </div>
  `;
}

// 5. Modal de Creación de Orden de Fabricación
function renderCreateOrderModal(state, data) {
  const approvedRecipes = state.recipes.filter((r) => r.status === "Aprobada");
  const initialRecipeId = data?.recipeId || approvedRecipes[0]?.id;
  const selectedRecipe = state.recipes.find((r) => r.id === initialRecipeId) || approvedRecipes[0];
  const defaultSize = data?.batchSize || selectedRecipe?.baseBatchSize || 1000;
  const defaultUnit = data?.batchUnit || selectedRecipe?.baseUnit || "kg";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            ${icon("FileSpreadsheet", { size: 20 })}
            <span>Programar Nueva Orden de Fabricación</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Seleccionar Receta Homologada:</label>
            <select id="modal-order-recipe" class="form-control">
              ${approvedRecipes.map(
                (r) => `
                <option value="${r.id}" ${r.id === selectedRecipe?.id ? "selected" : ""}>
                  ${r.recipeCode} (${r.version}) - ${r.productName} [Base: ${r.baseBatchSize} ${r.baseUnit}]
                </option>
              `
              ).join("")}
            </select>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Tamaño del Lote a Fabricar:</label>
              <input type="number" id="modal-order-size" class="form-control font-mono" value="${defaultSize}" step="any" min="1" required />
            </div>

            <div class="form-group">
              <label class="form-label">Unidad:</label>
              <select id="modal-order-unit" class="form-control">
                <option value="kg" ${defaultUnit === "kg" ? "selected" : ""}>Kilogramos (kg)</option>
                <option value="L" ${defaultUnit === "L" ? "selected" : ""}>Litros (L)</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Reactor / Mezclador:</label>
              <select id="modal-order-reactor" class="form-control">
                <option value="Reactor Dispersor R-01 (Cowles)">Reactor Dispersor R-01 (Cowles)</option>
                <option value="Mezclador Planetario de Pastas M-02">Mezclador Planetario de Pastas M-02</option>
                <option value="Dispersor Rápido de Pinturas D-03">Dispersor Rápido de Pinturas D-03</option>
                <option value="Reactor Homogenizador R-04">Reactor Homogenizador R-04</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Operario Asignado:</label>
              <select id="modal-order-operator" class="form-control">
                <option value="Jorge Ramírez">Jorge Ramírez (Operario Planta)</option>
                <option value="Marcos Soto">Marcos Soto (Supervisor / Op. Senior)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fecha Programada:</label>
            <input type="date" id="modal-order-date" class="form-control" value="${new Date().toISOString().split("T")[0]}" />
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones u Orden de Cliente:</label>
            <textarea id="modal-order-notes" class="form-control" rows="2" placeholder="Notas sobre especificaciones de empaque o prioridad..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-primary" id="btn-submit-create-order">
            Crear Orden y Hoja de Fabricación
          </button>
        </div>
      </div>
    </div>
  `;
}

// 6. Modal de Pesaje de Materia Prima (Tara real y Lote MP)
function renderTareModal(state, data) {
  const order = state.orders.find((o) => o.id === data?.orderId);
  const comp = order?.components?.find((c) => c.id === data?.compId);
  if (!order || !comp) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            ${icon("Scale", { size: 20 })}
            <span>Registro de Pesaje Real en Planta</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div style="background:#f8fafc; border:1px solid var(--border-light); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Materia Prima:</div>
            <strong style="font-size:1.05rem; color:#0f172a;">${comp.name}</strong>
            <div style="margin-top:0.35rem; font-size:0.85rem;">
              Código: <span class="font-mono" style="font-weight:700;">${comp.code}</span> | 
              Cantidad Requerida Teórica: <strong class="font-mono" style="color:#0284c7;">${formatNumber(comp.targetQty, 2)} ${comp.unit}</strong>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cantidad Real Pesada en Báscula (${comp.unit}):</label>
            <input 
              type="number" 
              id="tare-actual-qty" 
              class="form-control font-mono" 
              value="${comp.actualQty !== null && comp.actualQty !== undefined ? comp.actualQty : comp.targetQty}" 
              step="any"
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Número de Lote de Materia Prima (Trazabilidad de Insumo):</label>
            <input 
              type="text" 
              id="tare-raw-lot" 
              class="form-control font-mono" 
              value="${comp.rawMaterialLot || `LOT-${comp.code}-2026-`}" 
              placeholder="Ej. LOT-MP-AGU-2026-99" 
              required 
            />
            <span class="form-hint">Dato obligatorio para trazabilidad en caso de no conformidad.</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-primary" id="btn-save-tare" data-order-id="${order.id}" data-comp-id="${comp.id}">
            Guardar y Firmar Pesaje
          </button>
        </div>
      </div>
    </div>
  `;
}

// 7. Modal de Confirmación de Paso Crítico
function renderCriticalConfirmModal(state, data) {
  const order = state.orders.find((o) => o.id === data?.orderId);
  const step = order?.steps?.find((s) => s.stepNum === data?.stepNum);
  if (!order || !step) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title" style="color:#dc2626;">
            ${icon("ShieldAlert", { size: 22 })}
            <span>Autorización Formal de Paso Crítico de Seguridad</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="critical-warning-box">
            <div>
              <strong>ALERTA DE SEGURIDAD INDUSTRIAL:</strong><br>
              ${step.criticalWarning || "Este paso tiene impacto directo en la integridad del lote y la seguridad física del reactor."}
            </div>
          </div>

          <div style="font-size:0.85rem; color:#334155; margin-bottom:1rem; line-height:1.5;">
            <strong>Etapa ${step.stepNum}:</strong> ${step.title}<br>
            <em>${step.instruction}</em>
          </div>

          <div class="form-group">
            <label class="form-label">Comentario o Confirmación de Parámetros Verificados:</label>
            <textarea id="critical-confirm-comment" class="form-control" rows="3" placeholder="Certifico que la temperatura, agitación y condiciones de adición se encuentran en los rangos de seguridad autorizados...">Temperatura y velocidad de agitación verificadas dentro de límites permisibles.</textarea>
          </div>

          <div style="background:#f8fafc; padding:0.75rem; border-radius:var(--radius-md); font-size:0.78rem; color:var(--text-muted);">
            Autorizado por: <strong>${state.currentUser.name}</strong> (${state.currentUser.roleLabel})
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-danger" id="btn-submit-critical-confirm" data-order-id="${order.id}" data-step-num="${step.stepNum}">
            Confirmar y Autorizar Etapa
          </button>
        </div>
      </div>
    </div>
  `;
}

// 8. Modal de Finalizar Etapa con Parámetros Reales
function renderFinishStepModal(state, data) {
  const order = state.orders.find((o) => o.id === data?.orderId);
  const step = order?.steps?.find((s) => s.stepNum === data?.stepNum);
  if (!order || !step) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            ${icon("CheckCircle", { size: 20 })}
            <span>Registrar Parámetros Reales y Finalizar Etapa ${step.stepNum}</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div style="font-size:0.88rem; font-weight:700; color:#0f172a; margin-bottom:1rem;">
            ${step.title}
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Temperatura Medida (°C):</label>
              <input 
                type="text" 
                id="finish-step-temp" 
                class="form-control font-mono" 
                placeholder="Ej. 34.5 °C" 
                value="${step.actualTemp || step.tempTarget || ""}" 
              />
              <span class="form-hint">Objetivo: ${step.tempTarget || "Ambiente"}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Velocidad Medida (RPM):</label>
              <input 
                type="number" 
                id="finish-step-rpm" 
                class="form-control font-mono" 
                placeholder="Ej. 500" 
                value="${step.actualRpm || step.rpmTarget || ""}" 
              />
              <span class="form-hint">Objetivo: ${step.rpmTarget ? `${step.rpmTarget} RPM` : "N/A"}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones del Operario en Planta:</label>
            <textarea id="finish-step-notes" class="form-control" rows="2" placeholder="Comentarios sobre el aspecto coloidal, ruido de agitación o viscosidad visual...">${step.operatorNote || "Etapa finalizada conforme."}</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-success" id="btn-submit-finish-step" data-order-id="${order.id}" data-step-num="${step.stepNum}">
            Completar Etapa
          </button>
        </div>
      </div>
    </div>
  `;
}

// 9. Modal de Registro de Incidencias / Desviaciones
function renderIncidentModal(state, data) {
  const order = state.orders.find((o) => o.id === data?.orderId);
  if (!order) return "";

  return `
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title" style="color:#dc2626;">
            ${icon("AlertTriangle", { size: 20 })}
            <span>Reportar Incidencia o Desviación de Proceso</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Lote Afectado:</label>
            <input type="text" class="form-control font-mono" value="${order.batchNumber} (${order.productName})" readonly />
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Tipo de Desviación:</label>
              <select id="inc-type" class="form-control">
                <option value="Desviación de Temperatura">Desviación de Temperatura</option>
                <option value="Falla Mecánica o de Agitación">Falla Mecánica o de Agitación</option>
                <option value="Variación de Materia Prima">Variación de Materia Prima</option>
                <option value="Corte Eléctrico / Pausa">Corte Eléctrico / Pausa</option>
                <option value="Anomalía de Viscosidad o Color">Anomalía de Viscosidad o Color</option>
                <option value="Otro">Otro Incidente</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nivel de Severidad:</label>
              <select id="inc-severity" class="form-control">
                <option value="Baja">Baja (Observación sin impacto crítico)</option>
                <option value="Media" selected>Media (Requiere corrección de turno)</option>
                <option value="Alta">Alta (Lote retenido para Calidad / I+D)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción Detallada del Suceso:</label>
            <textarea id="inc-desc" class="form-control" rows="3" placeholder="Explique qué sucedió, en qué minuto y cuáles fueron las lecturas de los instrumentos..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Acción Correctiva Inmediata o Plan de Mitigación:</label>
            <textarea id="inc-action" class="form-control" rows="2" placeholder="Qué medidas se tomaron de inmediato (enfriamiento, toma de muestra, etc.)..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-danger" id="btn-submit-incident" data-order-id="${order.id}">
            Registrar Incidencia Oficial
          </button>
        </div>
      </div>
    </div>
  `;
}

// 10. Modal de Creación de Nueva Receta Borrador
function renderRecipeEditorModal(state) {
  return `
    <div class="modal-overlay">
      <div class="modal-dialog large">
        <div class="modal-header">
          <div class="modal-title">
            ${icon("FlaskConical", { size: 20 })}
            <span>Crear Nueva Receta de Fabricación (Borrador)</span>
          </div>
          <button class="btn btn-ghost btn-sm modal-close-btn">${icon("X", { size: 18 })}</button>
        </div>
        <div class="modal-body">
          <div class="safety-alert-banner">
            <div>
              <strong>REGLA DE SEGURIDAD TÉCNICA:</strong> Toda nueva receta se crea automáticamente en estado <strong>'Borrador'</strong>. Para pasar a producción oficial debe ser aprobada explícitamente por el Responsable Técnico o Administrador.
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Producto Químico:</label>
              <select id="new-rec-product" class="form-control">
                ${state.products.map(
                  (p) => `<option value="${p.id}">${p.name} (${p.category})</option>`
                ).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Código de Receta:</label>
              <input type="text" id="new-rec-code" class="form-control font-mono" placeholder="Ej. REC-CER-600" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Título Oficial de la Formulación:</label>
            <input type="text" id="new-rec-title" class="form-control" placeholder="Ej. Emulsión Hidrófuga Silicónica de Secado Rápido" required />
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Tamaño Base (Lote Estándar):</label>
              <input type="number" id="new-rec-base-size" class="form-control font-mono" value="1000" min="1" required />
            </div>

            <div class="form-group">
              <label class="form-label">Unidad:</label>
              <select id="new-rec-unit" class="form-control">
                <option value="kg">kg (Masa)</option>
                <option value="L">L (Volumen)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Densidad Homologada (kg/L):</label>
              <input type="number" id="new-rec-density" class="form-control font-mono" value="1.000" step="0.001" min="0.1" required />
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Lote Mínimo Recomendado:</label>
              <input type="number" id="new-rec-min" class="form-control font-mono" value="250" min="1" required />
            </div>

            <div class="form-group">
              <label class="form-label">Lote Máximo Recomendado:</label>
              <input type="number" id="new-rec-max" class="form-control font-mono" value="2000" min="1" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Justificación o Motivo Técnico:</label>
            <textarea id="new-rec-reason" class="form-control" rows="2" placeholder="Motivo de la creación de esta receta..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancelar</button>
          <button class="btn btn-primary" id="btn-submit-new-recipe">
            Guardar Receta Borrador
          </button>
        </div>
      </div>
    </div>
  `;
}

// BINDING DE EVENTOS DE MODALES
export function bindModalEvents(container) {
  // Botones de cierre comunes
  container.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.closeModal();
    });
  });

  // Cerrar haciendo clic en el backdrop
  const overlay = container.querySelector(".modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        store.closeModal();
      }
    });
  }

  // Ir a calcular lote desde el modal de receta
  const btnModalCalc = container.querySelector("#btn-modal-calc-batch");
  if (btnModalCalc) {
    btnModalCalc.addEventListener("click", () => {
      const id = btnModalCalc.getAttribute("data-recipe-id");
      store.closeModal();
      store.navigate("calculator", { recipeId: id });
    });
  }

  // Confirmar duplicación de receta
  const btnConfirmDup = container.querySelector("#btn-confirm-duplicate");
  if (btnConfirmDup) {
    btnConfirmDup.addEventListener("click", () => {
      const recipeId = btnConfirmDup.getAttribute("data-recipe-id");
      const verLabel = container.querySelector("#dup-version-label").value.trim();
      const reason = container.querySelector("#dup-reason").value.trim();

      if (!verLabel) {
        showToast("Ingrese una etiqueta de versión válida", "error");
        return;
      }
      if (!reason) {
        showToast("Indique el motivo técnico del cambio", "error");
        return;
      }

      store.duplicateRecipe(recipeId, verLabel, reason);
      store.closeModal();
      showToast(`Propuesta ${verLabel} creada en borrador. La versión aprobada se mantiene intacta.`, "success");
    });
  }

  // Confirmar aprobación técnica
  const btnConfirmApprove = container.querySelector("#btn-confirm-approve");
  if (btnConfirmApprove) {
    btnConfirmApprove.addEventListener("click", () => {
      const recipeId = btnConfirmApprove.getAttribute("data-recipe-id");
      const notes = container.querySelector("#approve-notes").value.trim();

      try {
        store.approveRecipe(recipeId, notes);
        store.closeModal();
        showToast("Receta aprobada oficialmente para producción.", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Guardar pesaje de tara
  const btnSaveTare = container.querySelector("#btn-save-tare");
  if (btnSaveTare) {
    btnSaveTare.addEventListener("click", () => {
      const orderId = btnSaveTare.getAttribute("data-order-id");
      const compId = btnSaveTare.getAttribute("data-comp-id");
      const actualQty = parseFloat(container.querySelector("#tare-actual-qty").value);
      const rawLot = container.querySelector("#tare-raw-lot").value.trim();

      if (isNaN(actualQty) || actualQty <= 0) {
        showToast("Ingrese una cantidad real pesada válida mayor a 0", "error");
        return;
      }
      if (!rawLot) {
        showToast("El número de lote de materia prima es obligatorio para trazabilidad", "error");
        return;
      }

      store.updateOrderTare(orderId, compId, actualQty, rawLot);
      store.closeModal();
      showToast("Pesaje y lote de insumo registrados exitosamente", "success");
    });
  }

  // Confirmar paso crítico
  const btnSubmitCritical = container.querySelector("#btn-submit-critical-confirm");
  if (btnSubmitCritical) {
    btnSubmitCritical.addEventListener("click", () => {
      const orderId = btnSubmitCritical.getAttribute("data-order-id");
      const stepNum = parseInt(btnSubmitCritical.getAttribute("data-step-num"), 10);
      const comment = container.querySelector("#critical-confirm-comment").value.trim();

      store.confirmCriticalStep(orderId, stepNum, comment);
      store.closeModal();
      showToast(`Paso Crítico ${stepNum} formalmente autorizado y firmado`, "success");
    });
  }

  // Finalizar etapa
  const btnSubmitFinish = container.querySelector("#btn-submit-finish-step");
  if (btnSubmitFinish) {
    btnSubmitFinish.addEventListener("click", () => {
      const orderId = btnSubmitFinish.getAttribute("data-order-id");
      const stepNum = parseInt(btnSubmitFinish.getAttribute("data-step-num"), 10);
      const temp = container.querySelector("#finish-step-temp").value.trim();
      const rpm = container.querySelector("#finish-step-rpm").value.trim();
      const notes = container.querySelector("#finish-step-notes").value.trim();

      store.finishOrderStep(orderId, stepNum, {
        actualTemp: temp,
        actualRpm: rpm ? parseInt(rpm, 10) : null,
        operatorNote: notes
      });
      store.closeModal();
      showToast(`Etapa ${stepNum} finalizada con éxito`, "success");
    });
  }

  // Reportar incidencia
  const btnSubmitIncident = container.querySelector("#btn-submit-incident");
  if (btnSubmitIncident) {
    btnSubmitIncident.addEventListener("click", () => {
      const orderId = btnSubmitIncident.getAttribute("data-order-id");
      const type = container.querySelector("#inc-type").value;
      const severity = container.querySelector("#inc-severity").value;
      const desc = container.querySelector("#inc-desc").value.trim();
      const action = container.querySelector("#inc-action").value.trim();

      if (!desc) {
        showToast("Debe describir la desviación ocurrida", "error");
        return;
      }

      store.addOrderIncident(orderId, {
        type,
        severity,
        description: desc,
        actionPlan: action
      });
      store.closeModal();
      showToast("Incidencia registrada en el expediente del lote", "warning");
    });
  }

  // Crear nueva orden
  const btnSubmitOrder = container.querySelector("#btn-submit-create-order");
  if (btnSubmitOrder) {
    btnSubmitOrder.addEventListener("click", () => {
      const recipeId = container.querySelector("#modal-order-recipe").value;
      const batchSize = parseFloat(container.querySelector("#modal-order-size").value);
      const batchUnit = container.querySelector("#modal-order-unit").value;
      const reactor = container.querySelector("#modal-order-reactor").value;
      const operator = container.querySelector("#modal-order-operator").value;
      const date = container.querySelector("#modal-order-date").value;
      const notes = container.querySelector("#modal-order-notes").value.trim();

      if (isNaN(batchSize) || batchSize <= 0) {
        showToast("Ingrese un tamaño de lote válido mayor a 0", "error");
        return;
      }

      const recipe = store.state.recipes.find((r) => r.id === recipeId);
      if (!recipe) return;

      const scaleFactor = batchSize / recipe.baseBatchSize;

      // Escalar componentes
      const components = (recipe.components || []).map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        targetQty: Math.round(c.baseQty * scaleFactor * 100) / 100,
        unit: c.unit,
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      }));

      // Copiar etapas
      const steps = (recipe.steps || []).map((s) => ({
        ...s,
        status: "Pendiente",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      }));

      const newOrder = store.createOrder({
        productId: recipe.productId,
        productName: recipe.productName,
        recipeId: recipe.id,
        recipeVersion: recipe.version,
        batchSize,
        batchUnit,
        scaleFactor: Number(scaleFactor.toFixed(3)),
        scheduledDate: date,
        targetReactor: reactor,
        operatorAssigned: operator,
        notes,
        components,
        steps
      });

      store.closeModal();
      showToast(`Orden ${newOrder.id} (${newOrder.batchNumber}) creada exitosamente`, "success");
      store.navigate("execution", { orderId: newOrder.id });
    });
  }

  // Crear nueva receta borrador
  const btnSubmitNewRecipe = container.querySelector("#btn-submit-new-recipe");
  if (btnSubmitNewRecipe) {
    btnSubmitNewRecipe.addEventListener("click", () => {
      const prodId = container.querySelector("#new-rec-product").value;
      const code = container.querySelector("#new-rec-code").value.trim();
      const title = container.querySelector("#new-rec-title").value.trim();
      const baseSize = parseFloat(container.querySelector("#new-rec-base-size").value);
      const unit = container.querySelector("#new-rec-unit").value;
      const density = parseFloat(container.querySelector("#new-rec-density").value);
      const minBatch = parseFloat(container.querySelector("#new-rec-min").value);
      const maxBatch = parseFloat(container.querySelector("#new-rec-max").value);
      const reason = container.querySelector("#new-rec-reason").value.trim();

      if (!code || !title) {
        showToast("Código y Título de receta son obligatorios", "error");
        return;
      }

      const product = store.state.products.find((p) => p.id === prodId);

      // Componentes de ejemplo base demostrativos
      const sampleComponents = [
        {
          id: "cmp-01",
          code: "MP-AGU-01",
          name: "Agua de Proceso Tratada (Ejemplo Demo)",
          baseQty: baseSize * 0.6,
          unit,
          percentage: 60.0,
          density: 1.0,
          handlingNotes: "Verificar conductividad."
        },
        {
          id: "cmp-02",
          code: "MP-ACT-01",
          name: "Ingrediente Activo Hidrofugante Base (Ejemplo Demo)",
          baseQty: baseSize * 0.38,
          unit,
          percentage: 38.0,
          density: 1.05,
          handlingNotes: "Dosificación lenta bajo agitación."
        },
        {
          id: "cmp-03",
          code: "MP-BIO-01",
          name: "Aditivo Preservante (Ejemplo Demo)",
          baseQty: baseSize * 0.02,
          unit,
          percentage: 2.0,
          density: 1.02,
          handlingNotes: "Uso de EPP obligatorio."
        }
      ];

      const sampleSteps = [
        {
          stepNum: 1,
          title: "Carga de Agua y Acondicionamiento",
          instruction: `Cargar ${baseSize * 0.6} ${unit} de agua tratada e iniciar agitación.`,
          estDurationMin: 20,
          tempTarget: "20 - 25 °C",
          rpmTarget: 300,
          isCritical: false,
          equipment: "Reactor R-01"
        },
        {
          stepNum: 2,
          title: "Incorporación de Activo Hidrófugo",
          instruction: "Adición controlada manteniendo temperatura por debajo de 38°C.",
          estDurationMin: 35,
          tempTarget: "25 - 35 °C",
          rpmTarget: 600,
          isCritical: true,
          criticalWarning: "PASO CRÍTICO: Control estricto de temperatura.",
          equipment: "Reactor R-01"
        }
      ];

      store.addRecipe({
        recipeCode: code,
        version: "v1.0-borrador",
        productId: prodId,
        productName: product?.name || "Producto Químico",
        title,
        baseBatchSize: baseSize,
        baseUnit: unit,
        densityRef: density,
        minBatchSize: minBatch,
        maxBatchSize: maxBatch,
        changeReason: reason || "Nueva propuesta de formulación en desarrollo",
        components: sampleComponents,
        steps: sampleSteps
      });

      store.closeModal();
      showToast(`Receta borrador '${code}' creada. Requiere aprobación técnica para pasar a producción.`, "success");
      store.navigate("recipes");
    });
  }
}
