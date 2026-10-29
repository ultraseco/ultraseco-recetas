// =========================================================================
// FORMATEADORES, ESTILOS DE ESTADO Y PERMISOS DE USUARIO
// =========================================================================

export function formatNumber(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return Number(val).toLocaleString("es-CL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "—";
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return dateTimeString;
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "Aprobada":
    case "Completada":
    case "Activo":
    case "Completado":
      return {
        bg: "badge-success",
        text: status,
        dot: "bg-emerald-500"
      };
    case "En curso":
      return {
        bg: "badge-in-progress",
        text: status,
        dot: "bg-blue-500"
      };
    case "Pendiente de aprobación":
    case "Programada":
    case "Pendiente":
      return {
        bg: "badge-pending",
        text: status,
        dot: "bg-amber-500"
      };
    case "Borrador":
      return {
        bg: "badge-draft",
        text: status,
        dot: "bg-slate-400"
      };
    case "Con incidencias":
      return {
        bg: "badge-incident",
        text: status,
        dot: "bg-rose-500"
      };
    case "Obsoleta":
    case "Discontinuado":
    case "Pausada":
      return {
        bg: "badge-deprecated",
        text: status,
        dot: "bg-gray-400"
      };
    default:
      return {
        bg: "badge-neutral",
        text: status || "N/A",
        dot: "bg-gray-400"
      };
  }
}

export function checkPermissions(currentUser) {
  const role = currentUser?.role || "operator";

  return {
    // Solo Responsable Técnico y Admin pueden aprobar recetas oficiales
    canApproveRecipe: ["admin", "technical"].includes(role),
    
    // Solo Técnico y Admin pueden retirar u obsolecer recetas
    canDeprecateRecipe: ["admin", "technical"].includes(role),
    
    // Admin, Técnico y Supervisor pueden crear/editar borradores de recetas
    canEditRecipe: ["admin", "technical", "supervisor"].includes(role),
    
    // Admin, Técnico y Supervisor pueden programar nuevas órdenes de fabricación
    canCreateOrder: ["admin", "supervisor", "technical"].includes(role),
    
    // Todos pueden registrar avances en órdenes, pero los pasos críticos requieren confirmación autorizada
    canOperate: true,
    
    // Supervisor y Admin pueden autorizar desviaciones o pasos críticos
    canAuthorizeCriticalStep: ["admin", "supervisor", "technical"].includes(role),
    
    // Solo Supervisor y Admin pueden cerrar formalmente una orden
    canCloseOrder: ["admin", "supervisor"].includes(role)
  };
}
