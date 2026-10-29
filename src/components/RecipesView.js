// =========================================================================
// GESTIÓN DE RECETAS INDUSTRIALES Y CONTROL DE VERSIONES
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber, formatDate, getStatusBadge } from "../utils/formatters.js";
import { showToast } from "./Toast.js";
import { DEMO_NOTICE } from "../data/initialData.js";

let selectedStatusFilter = "all";

export function renderRecipes(state) {
  const query = (state.searchQuery || "").toLowerCase();
  const filterProductId = state.viewParams?.filterProductId;
  const permissions = store.permissions;

  const filteredRecipes = state.recipes.filter((r) => {
    const matchesProduct = !filterProductId || r.productId === filterProductId;
    const matchesStatus =
      selectedStatusFilter === "all" ||
      (selectedStatusFilter === "Aprobada" && r.status === "Aprobada") ||
      (selectedStatusFilter === "Borrador" && (r.status === "Borrador" || r.status === "Pendiente de aprobación")) ||
      (selectedStatusFilter === "Obsoleta" && r.status === "Obsoleta");
    const matchesSearch =
      !query ||
      r.recipeCode.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.productName.toLowerCase().includes(query) ||
      r.version.toLowerCase().includes(query) ||
      (r.author && r.author.toLowerCase().includes(query));

    return matchesProduct && matchesStatus && matchesSearch;
  });

  const selectedProduct = filterProductId
    ? state.products.find((p) => p.id === filterProductId)
    : null;

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Gestión de Recetas Químicas & Versionado</h1>
          <p>Control estricto de formulaciones base, componentes, concentraciones y aprobaciones técnicas</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-primary" id="btn-create-recipe" ${!permissions.canEditRecipe ? "disabled title='Requiere permisos de edición'" : ""}>
            ${icon("Plus", { size: 17 })}
            <span>Crear Receta Borrador</span>
          </button>
        </div>
      </div>

      <!-- Filtro Activo por Producto si existe -->
      ${
        selectedProduct
          ? `
        <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; padding: 0.65rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size:0.85rem; color:#0369a1;">
            Filtrando recetas para el producto: <strong>${selectedProduct.name}</strong> (${selectedProduct.code})
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-clear-prod-filter">
            Quitar Filtro
          </button>
        </div>
      `
          : ""
      }

      <!-- Pestañas de Filtro por Estado -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-sm ${selectedStatusFilter === "all" ? "btn-primary" : "btn-secondary"}" data-status-filter="all">
            Todas (${state.recipes.length})
          </button>
          <button class="btn btn-sm ${selectedStatusFilter === "Aprobada" ? "btn-primary" : "btn-secondary"}" data-status-filter="Aprobada">
            Aprobadas Vigentes (${state.recipes.filter((r) => r.status === "Aprobada").length})
          </button>
          <button class="btn btn-sm ${selectedStatusFilter === "Borrador" ? "btn-primary" : "btn-secondary"}" data-status-filter="Borrador">
            Borradores / Propuestas (${state.recipes.filter((r) => r.status === "Borrador" || r.status === "Pendiente de aprobación").length})
          </button>
          <button class="btn btn-sm ${selectedStatusFilter === "Obsoleta" ? "btn-primary" : "btn-secondary"}" data-status-filter="Obsoleta">
            Histórico / Obsoletas (${state.recipes.filter((r) => r.status === "Obsoleta").length})
          </button>
        </div>

        <div style="font-size:0.8rem; color:var(--text-muted);">
          ${icon("Info", { size: 14, className: "inline" })} <em>Solo las recetas en estado 'Aprobada' pueden ser enviadas a fabricación.</em>
        </div>
      </div>

      <!-- Tabla de Recetas -->
      <div class="card">
        <div class="table-responsive">
          <table class="industrial-table">
            <thead>
              <tr>
                <th>Código / Versión</th>
                <th>Título de Formulación</th>
                <th>Producto Químico</th>
                <th>Lote Base</th>
                <th>Rango Operativo</th>
                <th>Estado</th>
                <th>Autor / Aprobador</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredRecipes.length === 0
                  ? `
                <tr>
                  <td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
                    No se encontraron recetas bajo este filtro.
                  </td>
                </tr>
              `
                  : filteredRecipes
                      .map((recipe) => {
                        const badge = getStatusBadge(recipe.status);
                        const isApproved = recipe.status === "Aprobada";

                        return `
                    <tr>
                      <td>
                        <strong style="color:var(--color-primary);">${recipe.recipeCode}</strong>
                        <span class="code-pill font-mono" style="font-size:0.75rem; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700; margin-left:4px;">
                          ${recipe.version}
                        </span>
                        ${recipe.isApprovedVersion ? `<span style="color:#059669; font-size:0.7rem; font-weight:700; display:block;">● VIGENTE</span>` : ""}
                      </td>
                      <td>
                        <strong>${recipe.title}</strong><br>
                        <span style="font-size:0.75rem; color:var(--text-muted);">
                          ${recipe.components?.length || 0} componentes | ${recipe.steps?.length || 0} etapas de proceso
                        </span>
                      </td>
                      <td>
                        <span style="font-size:0.85rem; font-weight:600;">${recipe.productName}</span>
                      </td>
                      <td>
                        <span class="font-mono" style="font-weight:700;">${formatNumber(recipe.baseBatchSize, 0)} ${recipe.baseUnit}</span>
                      </td>
                      <td>
                        <span class="font-mono" style="font-size:0.78rem;">${formatNumber(recipe.minBatchSize, 0)} - ${formatNumber(recipe.maxBatchSize, 0)} ${recipe.baseUnit}</span>
                      </td>
                      <td>
                        <span class="badge ${badge.bg}">
                          <span class="badge-dot" style="background-color: ${badge.dot ? badge.dot.replace('bg-', '') : 'currentColor'};"></span>
                          ${badge.text}
                        </span>
                      </td>
                      <td>
                        <span style="font-size:0.8rem; display:block;">Autor: <strong>${recipe.author || "—"}</strong></span>
                        <span style="font-size:0.72rem; color:var(--text-muted);">
                          ${recipe.approvedBy ? `Aprobó: ${recipe.approvedBy} (${formatDate(recipe.approvedDate)})` : "Pendiente de aprobación"}
                        </span>
                      </td>
                      <td style="text-align: right; white-space:nowrap;">
                        <button class="btn btn-secondary btn-sm" data-action="view-detail" data-recipe-id="${recipe.id}" title="Ver formulación completa">
                          ${icon("Eye", { size: 14 })}
                          <span>Ver</span>
                        </button>

                        <button class="btn btn-secondary btn-sm" data-action="duplicate-recipe" data-recipe-id="${recipe.id}" title="Duplicar para proponer nueva versión">
                          ${icon("Copy", { size: 14 })}
                          <span>Duplicar</span>
                        </button>

                        ${
                          !isApproved && permissions.canApproveRecipe
                            ? `
                          <button class="btn btn-success btn-sm" data-action="approve-recipe" data-recipe-id="${recipe.id}" title="Aprobar técnicamente esta versión">
                            ${icon("Check", { size: 14 })}
                            <span>Aprobar</span>
                          </button>
                        `
                            : ""
                        }

                        ${
                          isApproved
                            ? `
                          <button class="btn btn-primary btn-sm" data-action="calc-recipe" data-recipe-id="${recipe.id}" title="Calcular lote de producción">
                            ${icon("Scale", { size: 14 })}
                            <span>Calcular</span>
                          </button>
                        `
                            : ""
                        }
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

export function bindRecipesEvents(container) {
  container.querySelectorAll("[data-status-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedStatusFilter = btn.getAttribute("data-status-filter");
      store.notify();
    });
  });

  const btnClearFilter = container.querySelector("#btn-clear-prod-filter");
  if (btnClearFilter) {
    btnClearFilter.addEventListener("click", () => {
      store.navigate("recipes", { filterProductId: null });
    });
  }

  const btnCreate = container.querySelector("#btn-create-recipe");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      if (!store.permissions.canEditRecipe) {
        showToast("Su rol actual no tiene permisos para crear recetas.", "error");
        return;
      }
      store.openModal("recipeEditor");
    });
  }

  container.querySelectorAll("[data-action='view-detail']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-recipe-id");
      store.openModal("recipeDetail", { recipeId: id });
    });
  });

  container.querySelectorAll("[data-action='duplicate-recipe']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-recipe-id");
      store.openModal("duplicateRecipe", { recipeId: id });
    });
  });

  container.querySelectorAll("[data-action='approve-recipe']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-recipe-id");
      store.openModal("approveRecipe", { recipeId: id });
    });
  });

  container.querySelectorAll("[data-action='calc-recipe']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-recipe-id");
      store.navigate("calculator", { recipeId: id });
    });
  });
}
