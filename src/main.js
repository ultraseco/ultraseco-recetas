// =========================================================================
// PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN ULTRASECO
// =========================================================================
import { store } from "./store.js";
import { renderSidebar, bindSidebarEvents } from "./components/Sidebar.js";
import { renderTopbar, bindTopbarEvents } from "./components/Topbar.js";
import { renderDashboard, bindDashboardEvents } from "./components/DashboardView.js";
import { renderProducts, bindProductsEvents } from "./components/ProductsView.js";
import { renderRecipes, bindRecipesEvents } from "./components/RecipesView.js";
import { renderBatchCalculator, bindBatchCalculatorEvents } from "./components/BatchCalculatorView.js";
import { renderOrders, bindOrdersEvents } from "./components/OrdersView.js";
import { renderOrderExecution, bindOrderExecutionEvents } from "./components/OrderExecutionView.js";
import { renderReports, bindReportsEvents } from "./components/ReportsView.js";
import { renderAuditLog, bindAuditLogEvents } from "./components/AuditLogView.js";
import { renderModals, bindModalEvents } from "./components/Modals.js";

const appRoot = document.getElementById("app");

function renderApp() {
  const state = store.state;
  const view = state.currentView;

  let viewHtml = "";
  switch (view) {
    case "dashboard":
      viewHtml = renderDashboard(state);
      break;
    case "products":
      viewHtml = renderProducts(state);
      break;
    case "recipes":
      viewHtml = renderRecipes(state);
      break;
    case "calculator":
      viewHtml = renderBatchCalculator(state);
      break;
    case "orders":
      viewHtml = renderOrders(state);
      break;
    case "execution":
      viewHtml = renderOrderExecution(state);
      break;
    case "reports":
      viewHtml = renderReports(state);
      break;
    case "audit":
      viewHtml = renderAuditLog(state);
      break;
    default:
      viewHtml = renderDashboard(state);
  }

  const modalsHtml = renderModals(state);

  appRoot.innerHTML = `
    <div class="app-container">
      ${renderSidebar(state)}
      <div class="main-wrapper">
        ${renderTopbar(state)}
        <main id="main-content">
          ${viewHtml}
        </main>
      </div>
      <div id="modals-root">
        ${modalsHtml}
      </div>
    </div>
  `;

  // Binding de eventos
  bindSidebarEvents(appRoot);
  bindTopbarEvents(appRoot);

  switch (view) {
    case "dashboard":
      bindDashboardEvents(appRoot);
      break;
    case "products":
      bindProductsEvents(appRoot);
      break;
    case "recipes":
      bindRecipesEvents(appRoot);
      break;
    case "calculator":
      bindBatchCalculatorEvents(appRoot);
      break;
    case "orders":
      bindOrdersEvents(appRoot);
      break;
    case "execution":
      bindOrderExecutionEvents(appRoot);
      break;
    case "reports":
      bindReportsEvents(appRoot);
      break;
    case "audit":
      bindAuditLogEvents(appRoot);
      break;
    default:
      bindDashboardEvents(appRoot);
  }

  bindModalEvents(appRoot);
}

// Inicialización
store.subscribe(() => {
  renderApp();
});

// Render inicial
renderApp();
