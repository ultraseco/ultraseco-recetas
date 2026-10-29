// =========================================================================
// SISTEMA DE NOTIFICACIONES TOAST EN PLANTA
// =========================================================================
import { icon } from "../utils/icons.js";

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

export function showToast(message, type = "info", duration = 4000) {
  const container = ensureContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconName = "Info";
  if (type === "success") iconName = "CheckCircle";
  if (type === "error") iconName = "AlertCircle";
  if (type === "warning") iconName = "AlertTriangle";

  toast.innerHTML = `
    <div style="flex-shrink:0;">${icon(iconName, { size: 20 })}</div>
    <div style="flex:1; font-weight:500;">${message}</div>
    <button style="background:none; border:none; color:inherit; cursor:pointer; opacity:0.7; padding:2px;" class="toast-close">
      ${icon("X", { size: 16 })}
    </button>
  `;

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
