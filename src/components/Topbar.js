// =========================================================================
// BARRA SUPERIOR DE CONTROL Y CONMUTACIÓN DE ROLES (TOPBAR)
// =========================================================================
import { store } from "../store.js";
import { icon } from "../utils/icons.js";
import { INITIAL_USERS, DEMO_NOTICE } from "../data/initialData.js";
import { showToast } from "./Toast.js";

export function renderTopbar(state) {
  const currentUser = state.currentUser;

  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="global-search-box">
          <span class="global-search-icon">${icon("Search", { size: 17 })}</span>
          <input 
            type="text" 
            id="global-search-input" 
            placeholder="Buscar por producto, lote (LOT-...), orden (OF-...) o receta..." 
            value="${state.searchQuery || ""}"
          />
        </div>
      </div>

      <div class="topbar-right">
        <div class="demo-banner-top" title="Todos los datos son de ejemplo para pruebas">
          ${icon("AlertTriangle", { size: 15 })}
          <span>${DEMO_NOTICE}</span>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-open-safety" title="Ver Declaración de Seguridad e Instrucciones">
          ${icon("Shield", { size: 15 })}
          <span>Seguridad</span>
        </button>

        <button class="btn btn-ghost btn-sm" id="btn-reset-demo" title="Restaurar datos iniciales de demostración">
          ${icon("RotateCcw", { size: 15 })}
          <span>Reiniciar Demo</span>
        </button>

        <!-- Selector de Rol Activo para Pruebas Operativas -->
        <div class="role-switcher-card">
          <div class="user-avatar-circle ${currentUser.badgeColor}">
            ${currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div class="user-meta-text">
            <span class="user-name-label">${currentUser.name}</span>
            <span class="user-role-label">${currentUser.roleLabel}</span>
          </div>
          <select id="role-selector" class="role-select" title="Cambiar rol activo para probar permisos">
            ${INITIAL_USERS.map(
              (u) => `
              <option value="${u.id}" ${u.id === currentUser.id ? "selected" : ""}>
                ${u.roleLabel}
              </option>
            `
            ).join("")}
          </select>
        </div>
      </div>
    </header>
  `;
}

export function bindTopbarEvents(container) {
  const searchInput = container.querySelector("#global-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      store.setSearchQuery(e.target.value);
    });
  }

  const roleSelect = container.querySelector("#role-selector");
  if (roleSelect) {
    roleSelect.addEventListener("change", (e) => {
      const selectedId = e.target.value;
      store.setUser(selectedId);
      const user = INITIAL_USERS.find((u) => u.id === selectedId);
      showToast(`Rol cambiado a: ${user.roleLabel}`, "info");
    });
  }

  const btnSafety = container.querySelector("#btn-open-safety");
  if (btnSafety) {
    btnSafety.addEventListener("click", () => {
      store.openModal("safetyModal");
    });
  }

  const btnReset = container.querySelector("#btn-reset-demo");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("¿Desea restablecer todos los productos, recetas y órdenes a los valores iniciales de demostración? Los cambios no guardados se perderán.")) {
        store.resetToDemo();
        showToast("Datos de demostración restablecidos correctamente", "success");
      }
    });
  }
}
