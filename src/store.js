// =========================================================================
// GESTOR DE ESTADO REACTIVO INDUSTRIAL (STORE CON LOCALSTORAGE)
// =========================================================================

import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_RECIPES,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOG
} from "./data/initialData.js";
import { checkPermissions } from "./utils/formatters.js";

const STORAGE_KEY = "ultraseco_mfg_store_v1";

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          currentUser: parsed.currentUser || INITIAL_USERS[1], // Dra. Elena Valdés
          products: parsed.products || INITIAL_PRODUCTS,
          recipes: parsed.recipes || INITIAL_RECIPES,
          orders: parsed.orders || INITIAL_ORDERS,
          auditLog: parsed.auditLog || INITIAL_AUDIT_LOG,
          currentView: "dashboard",
          viewParams: {},
          calculatorParams: {
            recipeId: "REC-CER-500-v1.2",
            targetSize: 1500,
            targetUnit: "kg",
            customDensity: null,
            precision: 2
          },
          activeModal: null,
          modalData: null,
          searchQuery: ""
        };
      }
    } catch (err) {
      console.warn("Error al cargar localStorage, usando datos iniciales:", err);
    }

    return {
      currentUser: INITIAL_USERS[1], // Elena Valdés (Responsable Técnico)
      products: INITIAL_PRODUCTS,
      recipes: INITIAL_RECIPES,
      orders: INITIAL_ORDERS,
      auditLog: INITIAL_AUDIT_LOG,
      currentView: "dashboard",
      viewParams: {},
      calculatorParams: {
        recipeId: "REC-CER-500-v1.2",
        targetSize: 1500,
        targetUnit: "kg",
        customDensity: null,
        precision: 2
      },
      activeModal: null,
      modalData: null,
      searchQuery: ""
    };
  }

  saveState() {
    try {
      const toPersist = {
        currentUser: this.state.currentUser,
        products: this.state.products,
        recipes: this.state.recipes,
        orders: this.state.orders,
        auditLog: this.state.auditLog
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (err) {
      console.error("Error guardando en localStorage:", err);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Error en listener de store:", err);
      }
    });
  }

  get permissions() {
    return checkPermissions(this.state.currentUser);
  }

  // --- NAVEGACIÓN Y VISTAS ---

  navigate(view, params = {}) {
    this.state.currentView = view;
    this.state.viewParams = params;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query || "";
    this.notify();
  }

  setUser(userId) {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      this.state.currentUser = user;
      this.logAudit(
        "Cambio de Sesión",
        `Usuario: ${user.name}`,
        `Sesión activa cambiada al rol de ${user.roleLabel}.`
      );
      this.notify();
    }
  }

  // --- MODALES ---

  openModal(modalName, modalData = null) {
    this.state.activeModal = modalName;
    this.state.modalData = modalData;
    this.notify();
  }

  closeModal() {
    this.state.activeModal = null;
    this.state.modalData = null;
    this.notify();
  }

  // --- AUDITORÍA ---

  logAudit(action, entity, details) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newLog = {
      id: "aud-" + Date.now().toString(36),
      timestamp,
      user: this.state.currentUser.name,
      role: this.state.currentUser.roleLabel,
      action,
      entity,
      details
    };

    this.state.auditLog = [newLog, ...this.state.auditLog];
  }

  // --- RECETAS ---

  addRecipe(recipeData) {
    const newId = `REC-${Date.now().toString(36).toUpperCase()}-v${recipeData.version || "1.0"}`;
    const recipe = {
      ...recipeData,
      id: newId,
      status: "Borrador",
      isApprovedVersion: false,
      author: this.state.currentUser.name,
      authorRole: this.state.currentUser.roleLabel,
      createdAt: new Date().toISOString().split("T")[0],
      approvedBy: null,
      approvedDate: null,
      approvalNotes: null,
      history: [
        {
          version: recipeData.version || "v1.0",
          date: new Date().toISOString().split("T")[0],
          author: this.state.currentUser.name,
          status: "Borrador",
          notes: recipeData.changeReason || "Borrador inicial de nueva formulación."
        }
      ]
    };

    this.state.recipes = [recipe, ...this.state.recipes];
    this.logAudit("Creación de Receta", recipe.recipeCode, `Nueva receta borrador '${recipe.title}' creada.`);
    this.notify();
    return recipe;
  }

  duplicateRecipe(originalRecipeId, newVersionLabel, changeReason) {
    const original = this.state.recipes.find((r) => r.id === originalRecipeId);
    if (!original) return null;

    const newId = `${original.recipeCode}-${newVersionLabel}-draft`;
    const newRecipe = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      version: newVersionLabel,
      isApprovedVersion: false,
      status: "Borrador",
      author: this.state.currentUser.name,
      authorRole: this.state.currentUser.roleLabel,
      createdAt: new Date().toISOString().split("T")[0],
      approvedBy: null,
      approvedDate: null,
      approvalNotes: null,
      changeReason: changeReason || `Duplicación basada en la versión ${original.version}`,
      history: [
        ...(original.history || []),
        {
          version: newVersionLabel,
          date: new Date().toISOString().split("T")[0],
          author: this.state.currentUser.name,
          status: "Borrador",
          notes: changeReason || "Propuesta de nueva versión."
        }
      ]
    };

    this.state.recipes = [newRecipe, ...this.state.recipes];
    this.logAudit(
      "Duplicación de Receta",
      `${original.recipeCode} -> ${newVersionLabel}`,
      `Se duplicó la versión ${original.version} para crear la propuesta ${newVersionLabel}. Motivo: ${changeReason}`
    );
    this.notify();
    return newRecipe;
  }

  updateRecipe(recipeId, updatedData) {
    const idx = this.state.recipes.findIndex((r) => r.id === recipeId);
    if (idx === -1) return false;

    const old = this.state.recipes[idx];
    
    // Si la receta ya estaba aprobada, no permitimos sobreescribirla directamente: debe duplicarse
    if (old.status === "Aprobada") {
      throw new Error("No se permite modificar una receta aprobada directamente. Debe proponer una nueva versión duplicándola.");
    }

    this.state.recipes[idx] = {
      ...old,
      ...updatedData,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    this.logAudit(
      "Edición de Receta",
      old.recipeCode,
      `Modificación de campos en borrador ${old.version}.`
    );
    this.notify();
    return true;
  }

  approveRecipe(recipeId, approvalNotes) {
    if (!this.permissions.canApproveRecipe) {
      throw new Error("Acceso denegado: Solo el Responsable Técnico o Administrador pueden aprobar recetas.");
    }

    const idx = this.state.recipes.findIndex((r) => r.id === recipeId);
    if (idx === -1) return false;

    const target = this.state.recipes[idx];
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    // Si había una versión aprobada anterior del mismo recipeCode, la marcamos como obsoleta
    this.state.recipes = this.state.recipes.map((r) => {
      if (r.recipeCode === target.recipeCode && r.id !== target.id && r.status === "Aprobada") {
        return {
          ...r,
          status: "Obsoleta",
          isApprovedVersion: false,
          history: [
            ...(r.history || []),
            {
              version: r.version,
              date: nowStr.split(" ")[0],
              author: this.state.currentUser.name,
              status: "Obsoleta",
              notes: `Reemplazada por la versión aprobada ${target.version}`
            }
          ]
        };
      }
      return r;
    });

    // Actualizar la receta objetivo como aprobada
    const updated = {
      ...target,
      status: "Aprobada",
      isApprovedVersion: true,
      approvedBy: this.state.currentUser.name,
      approvedDate: nowStr,
      approvalNotes: approvalNotes || "Aprobada para producción industrial.",
      history: [
        ...(target.history || []),
        {
          version: target.version,
          date: nowStr.split(" ")[0],
          author: this.state.currentUser.name,
          status: "Aprobada",
          notes: approvalNotes || "Aprobación oficial de versión."
        }
      ]
    };

    this.state.recipes[idx] = updated;

    // Actualizar el producto relacionado con el nuevo ID de receta aprobada
    this.state.products = this.state.products.map((p) => {
      if (p.id === target.productId) {
        return {
          ...p,
          approvedRecipeId: updated.id,
          approvedVersion: updated.version,
          updatedAt: nowStr.split(" ")[0]
        };
      }
      return p;
    });

    this.logAudit(
      "Aprobación de Receta",
      `${target.recipeCode} (${target.version})`,
      `Aprobada por ${this.state.currentUser.name}. Notas: ${approvalNotes}`
    );
    this.notify();
    return true;
  }

  deprecateRecipe(recipeId, reason) {
    if (!this.permissions.canDeprecateRecipe) {
      throw new Error("Acceso denegado: Requiere rol de Responsable Técnico o Administrador.");
    }

    const idx = this.state.recipes.findIndex((r) => r.id === recipeId);
    if (idx === -1) return false;

    const r = this.state.recipes[idx];
    r.status = "Obsoleta";
    r.isApprovedVersion = false;
    this.logAudit(
      "Paso a Obsoleta",
      `${r.recipeCode} (${r.version})`,
      `Receta retirada de producción. Motivo: ${reason || "No especificado"}`
    );
    this.notify();
    return true;
  }

  // --- ÓRDENES DE FABRICACIÓN ---

  createOrder(orderData) {
    if (!this.permissions.canCreateOrder) {
      throw new Error("Acceso denegado: Su rol no tiene permisos para programar órdenes de fabricación.");
    }

    const count = this.state.orders.length + 1;
    const pad = (n) => String(n).padStart(4, "0");
    const ofId = `OF-2026-${pad(count)}`;
    const lotNum = `LOT-${orderData.productCode?.substring(0, 3) || "CHM"}-2026-${pad(count)}`;

    const newOrder = {
      id: ofId,
      batchNumber: lotNum,
      productId: orderData.productId,
      productName: orderData.productName,
      recipeId: orderData.recipeId,
      recipeVersion: orderData.recipeVersion,
      batchSize: orderData.batchSize,
      batchUnit: orderData.batchUnit || "kg",
      scaleFactor: orderData.scaleFactor,
      status: "Programada",
      scheduledDate: orderData.scheduledDate || new Date().toISOString().split("T")[0],
      targetReactor: orderData.targetReactor || "Reactor Principal R-01",
      operatorAssigned: orderData.operatorAssigned || "Jorge Ramírez",
      supervisorAssigned: this.state.currentUser.name,
      startTime: null,
      endTime: null,
      priority: orderData.priority || "Normal",
      notes: orderData.notes || "",
      components: orderData.components || [],
      steps: orderData.steps || [],
      incidents: []
    };

    this.state.orders = [newOrder, ...this.state.orders];
    this.logAudit(
      "Creación de Orden",
      `${newOrder.id} / ${newOrder.batchNumber}`,
      `Lote ${newOrder.batchSize} ${newOrder.batchUnit} programado para ${newOrder.productName}.`
    );
    this.notify();
    return newOrder;
  }

  updateOrderTare(orderId, compId, actualQty, rawMaterialLot) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const comp = order.components.find((c) => c.id === compId);
    if (!comp) return;

    comp.actualQty = Number(actualQty);
    comp.rawMaterialLot = rawMaterialLot || comp.rawMaterialLot || "LOTE-MP-GENERICO";
    comp.weighedBy = this.state.currentUser.name;
    comp.isWeighed = true;

    // Calcular desviación
    if (comp.targetQty > 0) {
      comp.deviationPct = ((comp.actualQty - comp.targetQty) / comp.targetQty) * 100;
    }

    this.logAudit(
      "Registro de Pesaje",
      `${order.batchNumber} / ${comp.code}`,
      `Pesado real: ${comp.actualQty} ${comp.unit} (Teórico: ${comp.targetQty} ${comp.unit}, Desv: ${comp.deviationPct?.toFixed(2)}%).`
    );
    this.notify();
  }

  startOrderStep(orderId, stepNum) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const step = order.steps.find((s) => s.stepNum === stepNum);
    if (!step) return;

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    step.status = "En curso";
    step.startedAt = nowStr;

    if (order.status === "Programada") {
      order.status = "En curso";
      order.startTime = nowStr;
    }

    this.logAudit(
      "Inicio de Etapa",
      `${order.batchNumber} / Paso ${stepNum}`,
      `Etapa '${step.title}' iniciada por ${this.state.currentUser.name}.`
    );
    this.notify();
  }

  finishOrderStep(orderId, stepNum, data = {}) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const step = order.steps.find((s) => s.stepNum === stepNum);
    if (!step) return;

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    step.status = "Completado";
    step.completedAt = nowStr;
    if (data.actualTemp) step.actualTemp = data.actualTemp;
    if (data.actualRpm) step.actualRpm = data.actualRpm;
    if (data.operatorNote) step.operatorNote = data.operatorNote;
    step.verifiedBy = this.state.currentUser.name;

    this.logAudit(
      "Finalización de Etapa",
      `${order.batchNumber} / Paso ${stepNum}`,
      `Etapa '${step.title}' completada. T: ${step.actualTemp || "N/A"}, RPM: ${step.actualRpm || "N/A"}.`
    );
    this.notify();
  }

  confirmCriticalStep(orderId, stepNum, supervisorComment) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const step = order.steps.find((s) => s.stepNum === stepNum);
    if (!step) return;

    step.criticalConfirmed = true;
    step.criticalConfirmedBy = this.state.currentUser.name;
    step.criticalConfirmedRole = this.state.currentUser.roleLabel;
    step.criticalConfirmedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    step.criticalSupervisorComment = supervisorComment || "Parámetros y límites de seguridad verificados conformes.";

    this.logAudit(
      "Confirmación Paso Crítico",
      `${order.batchNumber} / Paso ${stepNum}`,
      `Verificación de seguridad confirmada por ${this.state.currentUser.name}.`
    );
    this.notify();
  }

  addOrderIncident(orderId, incident) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newInc = {
      id: "inc-" + Date.now().toString(36),
      timestamp: nowStr,
      type: incident.type || "Desviación de Proceso",
      severity: incident.severity || "Media",
      description: incident.description,
      actionPlan: incident.actionPlan || "",
      reportedBy: this.state.currentUser.name,
      resolved: false
    };

    order.incidents.push(newInc);
    if (incident.severity === "Alta") {
      order.status = "Con incidencias";
    }

    this.logAudit(
      "Reporte de Incidencia",
      `${order.batchNumber}`,
      `Incidencia [${newInc.severity}]: ${newInc.description}`
    );
    this.notify();
  }

  completeOrder(orderId) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    // Validación de campos obligatorios configurados:
    // 1. Todas las materias primas deben estar pesadas
    const unweighed = order.components.filter((c) => !c.isWeighed);
    if (unweighed.length > 0) {
      throw new Error(`No se puede cerrar la orden: Faltan ${unweighed.length} componente(s) por registrar su pesaje real.`);
    }

    // 2. Todos los pasos críticos deben estar confirmados
    const unconfirmedCritical = order.steps.filter((s) => s.isCritical && !s.criticalConfirmed);
    if (unconfirmedCritical.length > 0) {
      throw new Error(`No se puede cerrar la orden: Hay ${unconfirmedCritical.length} paso(s) crítico(s) pendientes de confirmación formal de seguridad.`);
    }

    // 3. Todos los pasos deben estar completados
    const incompleteSteps = order.steps.filter((s) => s.status !== "Completado");
    if (incompleteSteps.length > 0) {
      throw new Error(`No se puede cerrar la orden: Faltan ${incompleteSteps.length} paso(s) del proceso por completar.`);
    }

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    order.status = "Completada";
    order.endTime = nowStr;

    this.logAudit(
      "Cierre de Orden de Fabricación",
      `${order.id} / ${order.batchNumber}`,
      `Lote ${order.batchNumber} finalizado y validado con éxito.`
    );
    this.notify();
  }

  // --- REINICIAR DATOS DE DEMOSTRACIÓN ---

  resetToDemo() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      currentUser: INITIAL_USERS[1],
      products: INITIAL_PRODUCTS,
      recipes: INITIAL_RECIPES,
      orders: INITIAL_ORDERS,
      auditLog: INITIAL_AUDIT_LOG,
      currentView: "dashboard",
      viewParams: {},
      calculatorParams: {
        recipeId: "REC-CER-500-v1.2",
        targetSize: 1500,
        targetUnit: "kg",
        customDensity: null,
        precision: 2
      },
      activeModal: null,
      modalData: null,
      searchQuery: ""
    };
    this.notify();
  }
}

export const store = new Store();
