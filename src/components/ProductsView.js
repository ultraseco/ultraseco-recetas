// =========================================================================
// CATÁLOGO INDUSTRIAL DE PRODUCTOS QUÍMICOS
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { formatNumber } from "../utils/formatters.js";
import { DEMO_NOTICE } from "../data/initialData.js";

let selectedCategoryFilter = "all";

export function renderProducts(state) {
  const query = (state.searchQuery || "").toLowerCase();
  
  const categories = [
    "Cera hidrofóbica con nanotecnología",
    "Estuco hidrofóbico",
    "Pintura hidrofóbica",
    "Producto tipo resina acrílica"
  ];

  const filteredProducts = state.products.filter((p) => {
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return `
    <div class="content-view">
      <div class="view-header">
        <div class="view-title-group">
          <h1>Catálogo de Productos Químicos</h1>
          <p>Líneas de formulación especializadas: ceras con nanotecnología, estucos, pinturas y resinas hidrofóbicas</p>
        </div>
      </div>

      <!-- Filtros por Categoría Industrial -->
      <div style="display:flex; gap:0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button class="btn btn-sm ${selectedCategoryFilter === "all" ? "btn-primary" : "btn-secondary"}" data-filter-cat="all">
          Todas las Categorías (${state.products.length})
        </button>
        ${categories
          .map((cat) => {
            const count = state.products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategoryFilter === cat;
            return `
            <button class="btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}" data-filter-cat="${cat}">
              ${cat} (${count})
            </button>
          `;
          })
          .join("")}
      </div>

      <!-- Tarjetas de Productos -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.25rem;">
        ${
          filteredProducts.length === 0
            ? `
          <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); color: var(--text-muted);">
            No se encontraron productos para los criterios seleccionados.
          </div>
        `
            : filteredProducts
                .map((product) => {
                  const approvedRecipe = state.recipes.find(
                    (r) => r.id === product.approvedRecipeId
                  );
                  const recipesForProduct = state.recipes.filter(
                    (r) => r.productId === product.id
                  );

                  return `
            <div class="card" style="margin-bottom: 0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div class="card-header">
                  <div>
                    <span class="code-pill font-mono" style="font-size:0.75rem; background:#f1f5f9; padding:2px 6px; border-radius:4px; color:var(--color-primary); font-weight:700;">
                      ${product.code}
                    </span>
                    <h3 style="font-size:1.1rem; font-weight:700; margin-top:0.35rem; color:#0f172a;">
                      ${product.name}
                    </h3>
                  </div>
                  <span class="badge badge-success">
                    <span class="badge-dot" style="background-color: #059669;"></span>
                    ${product.status}
                  </span>
                </div>

                <div class="card-body">
                  <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); font-weight:700; margin-bottom:0.25rem;">
                    Categoría
                  </div>
                  <div style="font-size:0.88rem; font-weight:600; color:#1e293b; margin-bottom:0.85rem;">
                    ${product.category}
                  </div>

                  <p style="font-size:0.84rem; color:var(--text-muted); line-height:1.45; margin-bottom:1rem;">
                    ${product.description}
                  </p>

                  <div style="background-color:#f8fafc; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.75rem; display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.78rem;">
                    <div>
                      <span style="color:var(--text-muted); display:block;">Presentación:</span>
                      <strong>${product.presentation}</strong>
                    </div>
                    <div>
                      <span style="color:var(--text-muted); display:block;">Densidad Teórica Ref:</span>
                      <strong class="font-mono">${formatNumber(product.densityRef, 3)} ${product.densityUnit}</strong>
                    </div>
                    <div style="grid-column: 1 / -1;">
                      <span style="color:var(--text-muted); display:block;">Equipo Industrial Recomendado:</span>
                      <strong style="color:#0284c7;">${product.recommendedEquipment}</strong>
                    </div>
                  </div>

                  <div style="margin-top:0.85rem; padding:0.65rem 0.85rem; background-color:#ecfdf5; border:1px solid #a7f3d0; border-radius:var(--radius-md); font-size:0.8rem; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <span style="color:#065f46; font-weight:600;">Receta Aprobada Vigente:</span><br>
                      <strong style="color:#064e3b;" class="font-mono">${product.approvedVersion}</strong>
                      <span style="color:#047857; font-size:0.75rem;">(${approvedRecipe ? approvedRecipe.title : "Homologada"})</span>
                    </div>
                    <span class="badge badge-success" style="font-size:0.7rem;">Válida</span>
                  </div>
                </div>
              </div>

              <div class="card-header" style="background:#f8fafc; border-top:1px solid var(--border-light); border-bottom:none; display:flex; justify-content:space-between; gap:0.5rem; flex-wrap:wrap;">
                <button class="btn btn-secondary btn-sm" data-action="view-recipes" data-product-id="${product.id}">
                  ${icon("FlaskConical", { size: 14 })}
                  <span>Ver Recetas (${recipesForProduct.length})</span>
                </button>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-secondary btn-sm" data-action="calc-batch" data-recipe-id="${product.approvedRecipeId}">
                    ${icon("Scale", { size: 14 })}
                    <span>Calcular</span>
                  </button>
                  <button class="btn btn-primary btn-sm" data-action="create-order" data-product-id="${product.id}" data-recipe-id="${product.approvedRecipeId}">
                    ${icon("Plus", { size: 14 })}
                    <span>Fabricar</span>
                  </button>
                </div>
              </div>
            </div>
          `;
                })
                .join("")
        }
      </div>
    </div>
  `;
}

export function bindProductsEvents(container) {
  container.querySelectorAll("[data-filter-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategoryFilter = btn.getAttribute("data-filter-cat");
      store.notify();
    });
  });

  container.querySelectorAll("[data-action='view-recipes']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-product-id");
      store.navigate("recipes", { filterProductId: prodId });
    });
  });

  container.querySelectorAll("[data-action='calc-batch']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const recipeId = btn.getAttribute("data-recipe-id");
      store.navigate("calculator", { recipeId });
    });
  });

  container.querySelectorAll("[data-action='create-order']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-product-id");
      const recipeId = btn.getAttribute("data-recipe-id");
      store.openModal("createOrder", { productId: prodId, recipeId });
    });
  });
}
