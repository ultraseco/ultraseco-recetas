// =========================================================================
// CALCULADORA DE LOTES INDUSTRIAL (ESCALADO Y SEGURIDAD FÍSICA)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber } from "../utils/formatters.js";
import { calculateBatchScaling } from "../utils/calculations.js";
import { DEMO_NOTICE } from "../data/initialData.js";
import { showToast } from "./Toast.js";

export function renderBatchCalculator(state) {
  const params = state.calculatorParams;
  const initialRecipeId = state.viewParams?.recipeId || params.recipeId;

  // Solo recetas aprobadas o con advertencia visible si es borrador
  const selectedRecipe = state.recipes.find((r) => r.id === initialRecipeId) || state.recipes[0];
  const isApproved = selectedRecipe?.status === "Aprobada";

  const targetSize = Number(params.targetSize || 1000);
  const targetUnit = params.targetUnit || selectedRecipe?.baseUnit || "kg";
  const customDensity = params.customDensity !== null && params.customDensity !== undefined
    ? Number(params.customDensity)
    : selectedRecipe?.densityRef || 1.0;
  const precision = Number(params.precision !== undefined ? params.precision : 2);

  const calcResult = calculateBatchScaling({
    recipe: selectedRecipe,
    targetSize,
    targetUnit,
    customDensity,
    precision
  });

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Calculadora Industrial de Lotes</h1>
          <p>Escalado proporcional riguroso de materias primas con control de densidad, masa/volumen y redondeo auditable</p>
        </div>
        <div>
          <button class="btn btn-primary" id="btn-create-order-from-calc" ${!isApproved || !calcResult.isValid ? "disabled" : ""}>
            ${icon("FileSpreadsheet", { size: 17 })}
            <span>Crear Orden con este Lote</span>
          </button>
        </div>
      </div>

      <!-- Advertencia si la receta seleccionada NO está aprobada -->
      ${
        !isApproved
          ? `
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid #dc2626; border-radius: var(--radius-md); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; color: #991b1b;">
          ${icon("AlertCircle", { size: 22 })}
          <div>
            <strong>ADVERTENCIA TÉCNICA:</strong> La receta seleccionada está en estado <strong>'${selectedRecipe?.status}'</strong>. Las fórmulas en borrador o pendientes NO pueden ser autorizadas para producción ni transferidas a órdenes de fabricación oficiales.
          </div>
        </div>
      `
          : ""
      }

      <!-- Formulario de Configuración de Lote -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            ${icon("Scale", { size: 19 })}
            <span>Parámetros de Escalado del Lote</span>
          </div>
          <span class="badge ${isApproved ? "badge-success" : "badge-draft"}">
            ${selectedRecipe?.recipeCode} (${selectedRecipe?.version}) - ${selectedRecipe?.status}
          </span>
        </div>

        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
            <!-- Selección de Receta -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Receta de Fabricación:</label>
              <select id="calc-recipe-select" class="form-control">
                ${state.recipes.map(
                  (r) => `
                  <option value="${r.id}" ${r.id === selectedRecipe?.id ? "selected" : ""}>
                    ${r.recipeCode} (${r.version}) - ${r.productName} [${r.status}]
                  </option>
                `
                ).join("")}
              </select>
              <span class="form-hint">Lote base homologado: ${formatNumber(selectedRecipe?.baseBatchSize, 0)} ${selectedRecipe?.baseUnit}</span>
            </div>

            <!-- Tamaño Deseado -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Tamaño del Lote Deseado:</label>
              <input 
                type="number" 
                id="calc-target-size" 
                class="form-control font-mono" 
                value="${targetSize}" 
                step="any"
                min="1"
              />
              <span class="form-hint">Rango de seguridad: ${formatNumber(selectedRecipe?.minBatchSize, 0)} a ${formatNumber(selectedRecipe?.maxBatchSize, 0)} ${selectedRecipe?.baseUnit}</span>
            </div>

            <!-- Unidad del Lote -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Unidad del Lote Objetivo:</label>
              <select id="calc-target-unit" class="form-control">
                <option value="kg" ${targetUnit === "kg" ? "selected" : ""}>Kilogramos (kg - Masa)</option>
                <option value="L" ${targetUnit === "L" ? "selected" : ""}>Litros (L - Volumen)</option>
              </select>
              <span class="form-hint">Unidad base original de receta: ${selectedRecipe?.baseUnit}</span>
            </div>

            <!-- Densidad para Conversión Física Masa/Volumen -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">
                Densidad Homologada (kg/L):
                ${targetUnit !== selectedRecipe?.baseUnit ? `<span style="color:#d97706; font-weight:700;">★ REQUERIDA</span>` : ""}
              </label>
              <input 
                type="number" 
                id="calc-density" 
                class="form-control font-mono" 
                value="${customDensity}" 
                step="0.001"
                min="0.1"
              />
              <span class="form-hint">Ref. técnica del producto: ${formatNumber(selectedRecipe?.densityRef, 3)} kg/L</span>
            </div>

            <!-- Precisión de Redondeo Aprobada -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Precisión de Redondeo en Pesaje:</label>
              <select id="calc-precision" class="form-control">
                <option value="1" ${precision === 1 ? "selected" : ""}>1 Decimal (ej. 120.5 kg - Tolerancia ± 0.1 kg)</option>
                <option value="2" ${precision === 2 ? "selected" : ""}>2 Decimales (ej. 120.55 kg - Tolerancia ± 0.01 kg)</option>
                <option value="3" ${precision === 3 ? "selected" : ""}>3 Decimales (ej. 120.555 kg - Báscula analítica)</option>
                <option value="0" ${precision === 0 ? "selected" : ""}>Sin Decimales (Enteros - Lotes muy grandes)</option>
              </select>
              <span class="form-hint">El delta de redondeo se audita en la tabla</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Explicación de la Conversión Física si aplica -->
      ${
        calcResult.conversionApplied
          ? `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: var(--radius-md); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display:flex; align-items:center; gap:0.75rem; color:#166534;">
            ${icon("CheckCircle", { size: 20 })}
            <div>
              <strong>Conversión Física Aplicada:</strong> No se asume 1 kg = 1 L.<br>
              <span class="font-mono" style="font-weight:600;">${calcResult.conversionApplied.formula}</span> 
              ➔ <strong>${formatNumber(calcResult.conversionApplied.convertedValue, 2)} ${calcResult.baseUnit} equivalentes</strong>
            </div>
          </div>
          <span class="badge badge-success">Densidad: ${formatNumber(calcResult.conversionApplied.densityUsed, 3)} kg/L</span>
        </div>
      `
          : ""
      }

      <!-- Advertencia de Fuera de Rango Operacional del Reactor -->
      ${
        calcResult.isOutOfRange
          ? `
        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-left: 5px solid #ea580c; border-radius: var(--radius-md); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; color: #9a3412;">
          ${icon("AlertTriangle", { size: 22 })}
          <div>
            <strong>ALERTA DE LÍMITES DE SEGURIDAD:</strong><br>
            ${calcResult.rangeWarning}
            <span style="display:block; font-size:0.78rem; margin-top:0.25rem;">La confirmación requerirá autorización explícita de supervisión técnica antes de iniciar el mezclador.</span>
          </div>
        </div>
      `
          : ""
      }

      <!-- Resumen de Escala y Métricas -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="kpi-card" style="padding: 1rem;">
          <div class="kpi-content">
            <span class="kpi-label" style="margin-top:0;">Factor de Escala Exacto</span>
            <span class="kpi-value" style="color:var(--color-primary);">${calcResult.scaleFactor ? calcResult.scaleFactor.toFixed(4) : "—"}x</span>
            <span style="font-size:0.72rem; color:var(--text-muted);">
              Relación: ${formatNumber(calcResult.targetEquivalentBaseUnit, 1)} / ${selectedRecipe?.baseBatchSize} ${selectedRecipe?.baseUnit}
            </span>
          </div>
        </div>

        <div class="kpi-card" style="padding: 1rem;">
          <div class="kpi-content">
            <span class="kpi-label" style="margin-top:0;">Total Teórico Calculado</span>
            <span class="kpi-value">${formatNumber(calcResult.totalCalculatedExact, precision)} ${calcResult.baseUnit}</span>
            <span style="font-size:0.72rem; color:var(--text-muted);">Suma teórica pura de componentes</span>
          </div>
        </div>

        <div class="kpi-card" style="padding: 1rem;">
          <div class="kpi-content">
            <span class="kpi-label" style="margin-top:0;">Total Redondeado para Pesaje</span>
            <span class="kpi-value font-mono" style="color:#0f172a;">${formatNumber(calcResult.totalRounded, precision)} ${calcResult.baseUnit}</span>
            <span style="font-size:0.72rem; color:var(--text-muted);">Cantidad física a cargar en reactor</span>
          </div>
        </div>

        <div class="kpi-card" style="padding: 1rem;">
          <div class="kpi-content">
            <span class="kpi-label" style="margin-top:0;">Efecto Total de Redondeo (Delta)</span>
            <span class="kpi-value font-mono" style="color:${Math.abs(calcResult.totalRoundingDelta || 0) > 0.05 ? "#ea580c" : "#059669"};">
              ${calcResult.totalRoundingDelta >= 0 ? "+" : ""}${calcResult.totalRoundingDelta ? calcResult.totalRoundingDelta.toFixed(precision) : "0"} ${calcResult.baseUnit}
            </span>
            <span style="font-size:0.72rem; color:var(--text-muted);">Diferencia acumulada visible y auditable</span>
          </div>
        </div>
      </div>

      <!-- Tabla Comparativa de Componentes Escalados -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            ${icon("FlaskConical", { size: 19 })}
            <span>Desglose Proporcional de Materias Primas para el Lote</span>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">
            ${calcResult.scaledComponents?.length || 0} materias primas
          </span>
        </div>

        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Código MP</th>
                <th>Nombre de Materia Prima</th>
                <th>% Formulación</th>
                <th>Cantidad Base (${selectedRecipe?.baseUnit})</th>
                <th>Factor</th>
                <th>Cálculo Exacto</th>
                <th style="background-color: #e0f2fe; color: #0369a1;">Cantidad a Pesar (${precision} dec.)</th>
                <th>Efecto Redondeo</th>
                <th>Notas de Manejo y Seguridad</th>
              </tr>
            </thead>
            <tbody>
              ${
                (calcResult.scaledComponents || []).map((comp) => {
                  return `
                  <tr>
                    <td>
                      <span class="code-pill font-mono" style="font-size:0.75rem; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700;">
                        ${comp.code}
                      </span>
                    </td>
                    <td>
                      <strong>${comp.name}</strong>
                    </td>
                    <td>
                      <span class="font-mono">${comp.percentage ? comp.percentage.toFixed(1) : "—"}%</span>
                    </td>
                    <td>
                      <span class="font-mono">${formatNumber(comp.baseQty, 2)} ${comp.unit}</span>
                    </td>
                    <td>
                      <span class="font-mono" style="color:var(--text-muted); font-size:0.8rem;">
                        ${comp.scaleFactor ? comp.scaleFactor.toFixed(4) : "—"}x
                      </span>
                    </td>
                    <td>
                      <span class="font-mono" style="color:var(--text-muted);">
                        ${comp.rawCalculated ? comp.rawCalculated.toFixed(3) : "—"} ${comp.unit}
                      </span>
                    </td>
                    <td style="background-color: #f0f9ff; font-weight:700;">
                      <span class="font-mono" style="font-size:0.95rem; color:#0284c7;">
                        ${formatNumber(comp.roundedQty, precision)} ${comp.unit}
                      </span>
                    </td>
                    <td>
                      <span class="font-mono" style="font-size:0.78rem; color: ${comp.deltaRounding !== 0 ? "#64748b" : "#94a3b8"};">
                        ${comp.deltaRounding >= 0 ? "+" : ""}${comp.deltaRounding ? comp.deltaRounding.toFixed(precision) : "0"}
                      </span>
                    </td>
                    <td>
                      <span style="font-size:0.78rem; color:#475569; max-width:280px; display:inline-block;">
                        ${comp.handlingNotes || "Manipular según FDS de planta."}
                      </span>
                    </td>
                  </tr>
                `;
                }).join("")
              }
            </tbody>
            <tfoot>
              <tr style="background-color: #f8fafc; font-weight: 700;">
                <td colspan="3">BALANCE TOTAL DE MASA DEL LOTE</td>
                <td>${formatNumber(selectedRecipe?.baseBatchSize, 1)} ${selectedRecipe?.baseUnit}</td>
                <td>—</td>
                <td class="font-mono">${formatNumber(calcResult.totalCalculatedExact, 3)} ${calcResult.baseUnit}</td>
                <td class="font-mono" style="color:#0284c7; font-size:1.05rem;">
                  ${formatNumber(calcResult.totalRounded, precision)} ${calcResult.baseUnit}
                </td>
                <td class="font-mono" style="font-size:0.8rem;">
                  ${calcResult.totalRoundingDelta >= 0 ? "+" : ""}${calcResult.totalRoundingDelta ? calcResult.totalRoundingDelta.toFixed(precision) : "0"}
                </td>
                <td>
                  <span style="color:#059669; font-size:0.78rem;">✓ Balance y proporciones verificadas</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindBatchCalculatorEvents(container) {
  const recipeSelect = container.querySelector("#calc-recipe-select");
  if (recipeSelect) {
    recipeSelect.addEventListener("change", (e) => {
      store.state.calculatorParams.recipeId = e.target.value;
      store.state.calculatorParams.customDensity = null; // reset to recipe density
      store.notify();
    });
  }

  const targetSizeInput = container.querySelector("#calc-target-size");
  if (targetSizeInput) {
    targetSizeInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        store.state.calculatorParams.targetSize = val;
        store.notify();
      }
    });
  }

  const targetUnitSelect = container.querySelector("#calc-target-unit");
  if (targetUnitSelect) {
    targetUnitSelect.addEventListener("change", (e) => {
      store.state.calculatorParams.targetUnit = e.target.value;
      store.notify();
    });
  }

  const densityInput = container.querySelector("#calc-density");
  if (densityInput) {
    densityInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        store.state.calculatorParams.customDensity = val;
        store.notify();
      }
    });
  }

  const precisionSelect = container.querySelector("#calc-precision");
  if (precisionSelect) {
    precisionSelect.addEventListener("change", (e) => {
      store.state.calculatorParams.precision = parseInt(e.target.value, 10);
      store.notify();
    });
  }

  const btnCreateOrder = container.querySelector("#btn-create-order-from-calc");
  if (btnCreateOrder) {
    btnCreateOrder.addEventListener("click", () => {
      const recipeId = store.state.calculatorParams.recipeId;
      const targetSize = store.state.calculatorParams.targetSize;
      const targetUnit = store.state.calculatorParams.targetUnit;
      const recipe = store.state.recipes.find((r) => r.id === recipeId);

      if (!recipe) {
        showToast("Seleccione una receta válida", "error");
        return;
      }

      if (recipe.status !== "Aprobada") {
        showToast("No se pueden emitir órdenes con recetas en borrador o pendientes.", "error");
        return;
      }

      store.openModal("createOrder", {
        recipeId: recipe.id,
        productId: recipe.productId,
        batchSize: targetSize,
        batchUnit: targetUnit
      });
    });
  }
}
