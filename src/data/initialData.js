// =========================================================================
// DATOS DE DEMOSTRACIÓN — SISTEMA INDUSTRIAL ULTRASECO
// AVISO IMPORTANTE: TODOS LOS DATOS, COMPONENTES, CONCENTRACIONES Y TIEMPOS
// SON PURAMENTE ILUSTRATIVOS PARA PRUEBAS DE SOFTWARE.
// "EJEMPLO — NO USAR EN PRODUCCIÓN QUÍMICA REAL"
// =========================================================================

export const DEMO_NOTICE = "EJEMPLO — NO USAR EN PRODUCCIÓN";
export const SAFETY_DISCLAIMER = "Aviso de Seguridad: Esta aplicación es una herramienta de cálculo, registro y trazabilidad operativa. No sustituye la revisión técnica calificada, las Fichas de Datos de Seguridad (FDS/MSDS), las normas de higiene y seguridad industrial, ni los procedimientos operativos estandarizados (POE) aprobados por la dirección técnica de la empresa.";

export const INITIAL_USERS = [
  {
    id: "usr-admin-01",
    name: "Ing. Carlos Mendoza",
    role: "admin",
    roleLabel: "Administrador de Planta",
    badgeColor: "purple",
    email: "c.mendoza@ultraseco-quimica.demo"
  },
  {
    id: "usr-tech-01",
    name: "Dra. Elena Valdés",
    role: "technical",
    roleLabel: "Responsable Técnico / I+D",
    badgeColor: "blue",
    email: "e.valdes@ultraseco-quimica.demo"
  },
  {
    id: "usr-sup-01",
    name: "Marcos Soto",
    role: "supervisor",
    roleLabel: "Supervisor de Turno",
    badgeColor: "amber",
    email: "m.soto@ultraseco-quimica.demo"
  },
  {
    id: "usr-op-01",
    name: "Jorge Ramírez",
    role: "operator",
    roleLabel: "Operario de Fabricación",
    badgeColor: "emerald",
    email: "j.ramirez@ultraseco-quimica.demo"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "PRD-CER-001",
    code: "ULTRA-CER-N500",
    name: "UltraCera NanoShield 500 (Ejemplo Demo)",
    category: "Cera hidrofóbica con nanotecnología",
    description: "Emulsión base acuosa de cera modificada con nanopartículas de silano para repelencia superficial y efecto hidrófugo duradero.",
    presentation: "Tambor 200 kg / Caneca 20 kg",
    densityRef: 0.985, // kg/L a 20°C
    densityUnit: "kg/L",
    status: "Activo",
    recommendedEquipment: "Reactor Dispersor R-01 (Cowles)",
    approvedRecipeId: "REC-CER-500-v1.2",
    approvedVersion: "v1.2",
    createdAt: "2026-01-10",
    updatedAt: "2026-08-15"
  },
  {
    id: "PRD-EST-002",
    code: "ULTRA-EST-AQ10",
    name: "UltraStucco Aquastop W-10 (Ejemplo Demo)",
    category: "Estuco hidrofóbico",
    description: "Pasta de acabado hidrófugo mineral lista para usar, con aditivos de hidro-repelencia en masa para fachadas y zonas húmedas.",
    presentation: "Balde plástico 25 kg / Tineta 15 L",
    densityRef: 1.620, // kg/L a 20°C (pasta densa)
    densityUnit: "kg/L",
    status: "Activo",
    recommendedEquipment: "Mezclador Planetario de Pastas M-02",
    approvedRecipeId: "REC-EST-010-v2.0",
    approvedVersion: "v2.0",
    createdAt: "2026-02-14",
    updatedAt: "2026-09-02"
  },
  {
    id: "PRD-PIN-003",
    code: "ULTRA-PIN-WP30",
    name: "HydroPaint Elastómero WP-300 (Ejemplo Demo)",
    category: "Pintura hidrofóbica",
    description: "Pintura arquitectónica impermeabilizante hidrofóbica base agua con tecnología de autolimpieza fotocatalítica e hidrorrepelencia.",
    presentation: "Caneca 5 gal (18.9 L) / Galón (3.78 L)",
    densityRef: 1.340, // kg/L a 20°C
    densityUnit: "kg/L",
    status: "Activo",
    recommendedEquipment: "Dispersor Rápido de Pinturas D-03",
    approvedRecipeId: "REC-PIN-300-v1.0",
    approvedVersion: "v1.0",
    createdAt: "2026-03-20",
    updatedAt: "2026-07-11"
  },
  {
    id: "PRD-RES-004",
    code: "ULTRA-RES-AC50",
    name: "UltraResin Binder AC-50 (Ejemplo Demo)",
    category: "Producto tipo resina acrílica",
    description: "Emulsión pura de polímero acrílico carboxilado diseñada como ligante y sellador para formulaciones de alta resistencia a intemperie.",
    presentation: "Tote IBC 1000 kg / Tambor 200 kg",
    densityRef: 1.045, // kg/L a 20°C
    densityUnit: "kg/L",
    status: "Activo",
    recommendedEquipment: "Reactor Polimerizador / Homogenizador R-04",
    approvedRecipeId: "REC-RES-050-v1.1",
    approvedVersion: "v1.1",
    createdAt: "2026-04-05",
    updatedAt: "2026-09-28"
  }
];

export const INITIAL_RECIPES = [
  {
    id: "REC-CER-500-v1.2",
    recipeCode: "REC-CER-500",
    version: "v1.2",
    isApprovedVersion: true,
    productId: "PRD-CER-001",
    productName: "UltraCera NanoShield 500 (Ejemplo Demo)",
    title: "Formulación Estándar Dispersión Cera NanoShield",
    status: "Aprobada", // "Borrador", "Pendiente de aprobación", "Aprobada", "Obsoleta"
    baseBatchSize: 1000,
    baseUnit: "kg",
    minBatchSize: 300,
    maxBatchSize: 2500,
    densityRef: 0.985,
    author: "Dra. Elena Valdés",
    authorRole: "Responsable Técnico / I+D",
    createdAt: "2026-08-10",
    approvedBy: "Dra. Elena Valdés",
    approvedDate: "2026-08-15 11:30",
    approvalNotes: "Validación satisfactoria en lote piloto de 300 kg. Viscosidad y repelencia dentro de especificación técnica.",
    changeReason: "Ajuste del orden de carga de la dispersión de silano para evitar choque térmico.",
    components: [
      {
        id: "cmp-01",
        code: "MP-AGU-01",
        name: "Agua Desmineralizada Tratada (Ejemplo Demo)",
        baseQty: 620,
        unit: "kg",
        percentage: 62.0,
        density: 1.000,
        handlingNotes: "Verificar conductividad < 5 µS/cm antes de la carga. Temperatura 20-25°C."
      },
      {
        id: "cmp-02",
        code: "MP-EMU-04",
        name: "Emulsionante No Iónico Base Éter (Ejemplo Demo)",
        baseQty: 45,
        unit: "kg",
        percentage: 4.5,
        density: 1.030,
        handlingNotes: "PRECAUCIÓN: Irritante ocular y dérmico. Usar guantes de nitrilo y careta facial."
      },
      {
        id: "cmp-03",
        code: "MP-CER-12",
        name: "Cera Sintética Micronizada en Polvo (Ejemplo Demo)",
        baseQty: 240,
        unit: "kg",
        percentage: 24.0,
        density: 0.920,
        handlingNotes: "Adición progresiva por tolva de dosificación a 600 RPM. Evitar polvo en suspensión."
      },
      {
        id: "cmp-04",
        code: "MP-NANO-02",
        name: "Dispersión Nanométrica de Sílice Funcionalizada (Ejemplo Demo)",
        baseQty: 80,
        unit: "kg",
        percentage: 8.0,
        density: 1.050,
        handlingNotes: "CRÍTICO: Inyección lenta continua a temperatura inferior a 38°C. Mantener agitación moderada."
      },
      {
        id: "cmp-05",
        code: "MP-BIO-01",
        name: "Preservante Biocida Isotiazolinona (Ejemplo Demo)",
        baseQty: 15,
        unit: "kg",
        percentage: 1.5,
        density: 1.020,
        handlingNotes: "TÓXICO POR CONTACTO. Uso estricto de respirador y gafas de seguridad homologadas."
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Inspección de Reactor y Carga de Fase Acuosa",
        instruction: "Verificar checklist de limpieza del Reactor R-01 (sin trazas de lotes anteriores). Pesar y cargar 620 kg de agua desmineralizada. Iniciar agitación de fondo a 250 RPM.",
        estDurationMin: 20,
        tempTarget: "20 - 25 °C",
        rpmTarget: 250,
        isCritical: false,
        criticalWarning: "",
        equipment: "Reactor R-01"
      },
      {
        stepNum: 2,
        title: "Dispersión de Tensoactivo y Homogenización",
        instruction: "Adicionar lentamente el emulsionante MP-EMU-04. Incrementar la velocidad a 500 RPM. Mantener agitación por 15 minutos hasta disolución completa sin espuma excesiva.",
        estDurationMin: 15,
        tempTarget: "22 - 28 °C",
        rpmTarget: 500,
        isCritical: false,
        criticalWarning: "",
        equipment: "Reactor R-01"
      },
      {
        stepNum: 3,
        title: "Incorporación de Cera y Cizallamiento Controlado",
        instruction: "Cargar MP-CER-12 mediante tolva de aspiración. Aumentar Cowles a 900 RPM. Mantener agitación constante. Monitorear temperatura con sonda calibrada; no exceder 40°C.",
        estDurationMin: 40,
        tempTarget: "32 - 38 °C",
        rpmTarget: 900,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Si la temperatura supera los 42°C la cera aglomera y arruina la estabilidad coloidal. Doble confirmación obligatoria.",
        equipment: "Reactor R-01"
      },
      {
        stepNum: 4,
        title: "Inyección de Nanotecnología de Sílice",
        instruction: "Reducir agitación a 350 RPM para evitar cavitación. Inyectar MP-NANO-02 a razón de 2.5 kg/minuto. Dejar en homogenización suave por 25 minutos.",
        estDurationMin: 35,
        tempTarget: "28 - 34 °C",
        rpmTarget: 350,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Verificar visualmente la no precipitación ni separación de fase.",
        equipment: "Reactor R-01"
      },
      {
        stepNum: 5,
        title: "Adición de Biocida, Control de Calidad y Enfriamiento",
        instruction: "Adicionar MP-BIO-01. Mezclar a 200 RPM por 15 minutos. Tomar muestra de 250 mL para laboratorio: medir pH (rango 7.2 - 8.2), sólidos (37.5 ± 1.0%) y viscosidad Brookfield.",
        estDurationMin: 25,
        tempTarget: "Ambiente (< 28°C)",
        rpmTarget: 200,
        isCritical: false,
        criticalWarning: "",
        equipment: "Reactor R-01"
      }
    ],
    history: [
      {
        version: "v1.0",
        date: "2026-05-02",
        author: "Dra. Elena Valdés",
        status: "Obsoleta",
        notes: "Formulación inicial en reactor piloto."
      },
      {
        version: "v1.1",
        date: "2026-06-18",
        author: "Dra. Elena Valdés",
        status: "Obsoleta",
        notes: "Aumento de biocida de 1.0% a 1.5% tras ensayo de envejecimiento acelerado."
      },
      {
        version: "v1.2",
        date: "2026-08-15",
        author: "Dra. Elena Valdés",
        status: "Aprobada",
        notes: "Optimización de rampa de adición de sílice funcionalizada. Versión vigente aprobada."
      }
    ]
  },
  {
    id: "REC-CER-500-v1.3-draft",
    recipeCode: "REC-CER-500",
    version: "v1.3-propuesta",
    isApprovedVersion: false,
    productId: "PRD-CER-001",
    productName: "UltraCera NanoShield 500 (Ejemplo Demo)",
    title: "Propuesta de Reducción de Tiempo de Dispersión Cera NanoShield",
    status: "Borrador", // Not approved yet!
    baseBatchSize: 1000,
    baseUnit: "kg",
    minBatchSize: 300,
    maxBatchSize: 2500,
    densityRef: 0.985,
    author: "Marcos Soto",
    authorRole: "Supervisor de Turno",
    createdAt: "2026-10-20",
    approvedBy: null,
    approvedDate: null,
    approvalNotes: null,
    changeReason: "Propuesta de prueba para ensayar nuevo antiespumante siliconado rápido.",
    components: [
      {
        id: "cmp-01",
        code: "MP-AGU-01",
        name: "Agua Desmineralizada Tratada (Ejemplo Demo)",
        baseQty: 615,
        unit: "kg",
        percentage: 61.5,
        density: 1.000,
        handlingNotes: "Verificar conductividad < 5 µS/cm."
      },
      {
        id: "cmp-02",
        code: "MP-EMU-04",
        name: "Emulsionante No Iónico Base Éter (Ejemplo Demo)",
        baseQty: 45,
        unit: "kg",
        percentage: 4.5,
        density: 1.030,
        handlingNotes: "Usar guantes de nitrilo."
      },
      {
        id: "cmp-03",
        code: "MP-CER-12",
        name: "Cera Sintética Micronizada en Polvo (Ejemplo Demo)",
        baseQty: 240,
        unit: "kg",
        percentage: 24.0,
        density: 0.920,
        handlingNotes: "Adición progresiva a 600 RPM."
      },
      {
        id: "cmp-04",
        code: "MP-NANO-02",
        name: "Dispersión Nanométrica de Sílice Funcionalizada (Ejemplo Demo)",
        baseQty: 80,
        unit: "kg",
        percentage: 8.0,
        density: 1.050,
        handlingNotes: "Inyección continua a T < 38°C."
      },
      {
        id: "cmp-05",
        code: "MP-BIO-01",
        name: "Preservante Biocida Isotiazolinona (Ejemplo Demo)",
        baseQty: 15,
        unit: "kg",
        percentage: 1.5,
        density: 1.020,
        handlingNotes: "TÓXICO POR CONTACTO."
      },
      {
        id: "cmp-06",
        code: "MP-ANT-03",
        name: "Aditivo Antiespumante Rápido Experimental (Ejemplo Demo)",
        baseQty: 5,
        unit: "kg",
        percentage: 0.5,
        density: 0.990,
        handlingNotes: "Componente en evaluación técnica. NO AUTORIZADO AÚN PARA PRODUCCIÓN."
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Carga de Agua y Antiespumante",
        instruction: "Cargar agua y pre-mezclar nuevo aditivo experimental a 300 RPM.",
        estDurationMin: 15,
        tempTarget: "20 - 25 °C",
        rpmTarget: 300,
        isCritical: false,
        criticalWarning: "",
        equipment: "Reactor R-01"
      }
    ],
    history: [
      {
        version: "v1.3-propuesta",
        date: "2026-10-20",
        author: "Marcos Soto",
        status: "Borrador",
        notes: "Borrador de optimización en espera de pruebas piloto de laboratorio."
      }
    ]
  },
  {
    id: "REC-EST-010-v2.0",
    recipeCode: "REC-EST-010",
    version: "v2.0",
    isApprovedVersion: true,
    productId: "PRD-EST-002",
    productName: "UltraStucco Aquastop W-10 (Ejemplo Demo)",
    title: "Fórmula Industrial Estuco Hidrófugo Mineral de Alta Adherencia",
    status: "Aprobada",
    baseBatchSize: 2000,
    baseUnit: "kg",
    minBatchSize: 500,
    maxBatchSize: 4000,
    densityRef: 1.620,
    author: "Dra. Elena Valdés",
    authorRole: "Responsable Técnico / I+D",
    createdAt: "2026-09-01",
    approvedBy: "Dra. Elena Valdés",
    approvedDate: "2026-09-02 16:45",
    approvalNotes: "Aprobada para línea continua de mezclador planetario M-02. Curva reológica validada.",
    changeReason: "Incorporación de aditivo hidrofugante en polvo siloxano concentrado.",
    components: [
      {
        id: "cmp-est-01",
        code: "MP-AGU-01",
        name: "Agua de Proceso Tratada (Ejemplo Demo)",
        baseQty: 480,
        unit: "kg",
        percentage: 24.0,
        density: 1.000,
        handlingNotes: "Carga directa por flujómetro calibrado."
      },
      {
        id: "cmp-est-02",
        code: "MP-DIS-02",
        name: "Dispersante Poliacrílico Sódico (Ejemplo Demo)",
        baseQty: 12,
        unit: "kg",
        percentage: 0.6,
        density: 1.220,
        handlingNotes: "Adicionar antes de las cargas minerales para facilitar mojado."
      },
      {
        id: "cmp-est-03",
        code: "MP-CAR-01",
        name: "Carbonato de Calcio Micronizado Malla 325 (Ejemplo Demo)",
        baseQty: 1100,
        unit: "kg",
        percentage: 55.0,
        density: 2.710,
        handlingNotes: "Extracción forzada de polvos encendida. Operario debe usar mascarilla N95."
      },
      {
        id: "cmp-est-04",
        code: "MP-POL-08",
        name: "Resina Polimérica Ligante Co-acrílica (Ejemplo Demo)",
        baseQty: 340,
        unit: "kg",
        percentage: 17.0,
        density: 1.050,
        handlingNotes: "Mantener en agitación moderada para evitar grumos."
      },
      {
        id: "cmp-est-05",
        code: "MP-HID-05",
        name: "Siloxano Hidrófugo Nanomodificado en Polvo (Ejemplo Demo)",
        baseQty: 50,
        unit: "kg",
        percentage: 2.5,
        density: 0.850,
        handlingNotes: "COMPONENTE CLAVE DE REPELENCIA: Pesar con balanza de precisión clase II (± 10 g)."
      },
      {
        id: "cmp-est-06",
        code: "MP-ESP-01",
        name: "Espesante Celulósico Éter Hidroxietílico (Ejemplo Demo)",
        baseQty: 18,
        unit: "kg",
        percentage: 0.9,
        density: 1.100,
        handlingNotes: "Pre-dispersar para evitar ojos de pescado."
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Carga de Agua y Dispersantes en Mezclador M-02",
        instruction: "Verificar paletas limpias. Cargar 480 kg de agua tratada y dosificar 12 kg de MP-DIS-02. Agitar a velocidad baja por 5 min.",
        estDurationMin: 15,
        tempTarget: "Ambiente",
        rpmTarget: 150,
        isCritical: false,
        criticalWarning: "",
        equipment: "Mezclador M-02"
      },
      {
        stepNum: 2,
        title: "Carga Progresiva de Carga Mineral Carbonatada",
        instruction: "Encender aspiración industrial. Adicionar los 1100 kg de MP-CAR-01 en 3 baches consecutivos de ~360 kg para evitar atascamiento de paletas.",
        estDurationMin: 30,
        tempTarget: "Ambiente",
        rpmTarget: 300,
        isCritical: false,
        criticalWarning: "",
        equipment: "Mezclador M-02"
      },
      {
        stepNum: 3,
        title: "Incorporación de Ligante y Siloxano Hidrófugo",
        instruction: "Adicionar MP-POL-08 lentamente. Seguidamente incorporar MP-HID-05. Amasar a velocidad media por 20 minutos hasta pasta homogénea brillante.",
        estDurationMin: 25,
        tempTarget: "< 35 °C",
        rpmTarget: 350,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Verificar distribución uniforme del siloxano para asegurar efecto perlado uniforme.",
        equipment: "Mezclador M-02"
      },
      {
        stepNum: 4,
        title: "Ajuste Reológico con Espesante y Control Final",
        instruction: "Adicionar MP-ESP-01. Mezclar durante 15 min. Medir consistencia en penetrómetro o cono de flujo. Envasar en baldes sellados.",
        estDurationMin: 20,
        tempTarget: "Ambiente",
        rpmTarget: 200,
        isCritical: false,
        criticalWarning: "",
        equipment: "Mezclador M-02"
      }
    ],
    history: [
      {
        version: "v1.0",
        date: "2026-02-18",
        author: "Dra. Elena Valdés",
        status: "Obsoleta",
        notes: "Versión base con estuco convencional."
      },
      {
        version: "v2.0",
        date: "2026-09-02",
        author: "Dra. Elena Valdés",
        status: "Aprobada",
        notes: "Fórmula de alta gama hidrófuga v2.0 aprobada para producción comercial."
      }
    ]
  },
  {
    id: "REC-PIN-300-v1.0",
    recipeCode: "REC-PIN-300",
    version: "v1.0",
    isApprovedVersion: true,
    productId: "PRD-PIN-003",
    productName: "HydroPaint Elastómero WP-300 (Ejemplo Demo)",
    title: "Pintura Impermeable Elastomérica Hidrofóbica Fachadas",
    status: "Aprobada",
    baseBatchSize: 1000,
    baseUnit: "kg",
    minBatchSize: 200,
    maxBatchSize: 2000,
    densityRef: 1.340,
    author: "Dra. Elena Valdés",
    authorRole: "Responsable Técnico / I+D",
    createdAt: "2026-07-08",
    approvedBy: "Dra. Elena Valdés",
    approvedDate: "2026-07-11 10:15",
    approvalNotes: "Aprobada tras ensayos de intemperismo acelerado QUV (1000 horas sin degradación).",
    changeReason: "Versión inicial aprobada para lanzamiento de línea de pinturas.",
    components: [
      {
        id: "cmp-pin-01",
        code: "MP-AGU-01",
        name: "Agua de Proceso Tratada (Ejemplo Demo)",
        baseQty: 320,
        unit: "kg",
        percentage: 32.0,
        density: 1.000,
        handlingNotes: "Agua tratada a 20°C."
      },
      {
        id: "cmp-pin-02",
        code: "MP-TIO-01",
        name: "Dióxido de Titanio Rutilo Grado Pinturas (Ejemplo Demo)",
        baseQty: 180,
        unit: "kg",
        percentage: 18.0,
        density: 4.230,
        handlingNotes: "Carga en dispersor Cowles a 1200 RPM para molienda fina (< 25 micras en Hegman)."
      },
      {
        id: "cmp-pin-03",
        code: "MP-RES-ELAS",
        name: "Resina Acrílica Elastomérica Flex (Ejemplo Demo)",
        baseQty: 420,
        unit: "kg",
        percentage: 42.0,
        density: 1.040,
        handlingNotes: "No calentar a más de 40°C. Carga bajo agitación lenta (300 RPM)."
      },
      {
        id: "cmp-pin-04",
        code: "MP-HID-SIL",
        name: "Aditivo Silicónico Hidrofugante para Pinturas (Ejemplo Demo)",
        baseQty: 35,
        unit: "kg",
        percentage: 3.5,
        density: 0.980,
        handlingNotes: "Proporciona repelencia y ángulo de contacto > 110°."
      },
      {
        id: "cmp-pin-05",
        code: "MP-COA-01",
        name: "Coalescente & Antiespumante Grado Pinturas (Ejemplo Demo)",
        baseQty: 30,
        unit: "kg",
        percentage: 3.0,
        density: 0.950,
        handlingNotes: "Adición controlada."
      },
      {
        id: "cmp-pin-06",
        code: "MP-BIO-02",
        name: "Fungicida / Alguicida para Exterior (Ejemplo Demo)",
        baseQty: 15,
        unit: "kg",
        percentage: 1.5,
        density: 1.010,
        handlingNotes: "Uso obligatorio de protección respiratoria."
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Dispersión de Pigmentos (Molienda Cowles)",
        instruction: "Cargar agua y aditivos humectantes. Agregar TiO2 a 1200 RPM. Mantener 25 minutos. Verificar molienda en medidor Hegman (mínimo 6 Hegman).",
        estDurationMin: 35,
        tempTarget: "25 - 35 °C",
        rpmTarget: 1200,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: La finura de molienda determina el poder cubriente y la impermeabilidad.",
        equipment: "Dispersor D-03"
      },
      {
        stepNum: 2,
        title: "Completación con Resina Elastomérica (Letdown)",
        instruction: "Reducir velocidad a 350 RPM. Incorporar resina elastomérica lentamente. Evitar inclusión de aire.",
        estDurationMin: 25,
        tempTarget: "< 35 °C",
        rpmTarget: 350,
        isCritical: false,
        criticalWarning: "",
        equipment: "Dispersor D-03"
      },
      {
        stepNum: 3,
        title: "Adición de Aditivo Silicónico y Estabilización",
        instruction: "Añadir aditivo hidrofugante MP-HID-SIL, coalescente y preservante. Mezclar 20 min. Ajustar viscosidad Krebs-Stormer (95 - 105 KU).",
        estDurationMin: 30,
        tempTarget: "Ambiente",
        rpmTarget: 250,
        isCritical: false,
        criticalWarning: "",
        equipment: "Dispersor D-03"
      }
    ],
    history: [
      {
        version: "v1.0",
        date: "2026-07-11",
        author: "Dra. Elena Valdés",
        status: "Aprobada",
        notes: "Versión inicial homologada."
      }
    ]
  },
  {
    id: "REC-RES-050-v1.1",
    recipeCode: "REC-RES-050",
    version: "v1.1",
    isApprovedVersion: true,
    productId: "PRD-RES-004",
    productName: "UltraResin Binder AC-50 (Ejemplo Demo)",
    title: "Emulsión Polimérica Acrílica Pura para Barnices y Selladores",
    status: "Aprobada",
    baseBatchSize: 1000,
    baseUnit: "kg",
    minBatchSize: 400,
    maxBatchSize: 3000,
    densityRef: 1.045,
    author: "Dra. Elena Valdés",
    authorRole: "Responsable Técnico / I+D",
    createdAt: "2026-09-25",
    approvedBy: "Ing. Carlos Mendoza",
    approvedDate: "2026-09-28 09:00",
    approvalNotes: "Validado por dirección técnica. Excelente transparencia de película seca y adherencia.",
    changeReason: "Ajuste de neutralizante para pH óptimo de 8.5.",
    components: [
      {
        id: "cmp-res-01",
        code: "MP-AGU-01",
        name: "Agua Desmineralizada Pura (Ejemplo Demo)",
        baseQty: 500,
        unit: "kg",
        percentage: 50.0,
        density: 1.000,
        handlingNotes: "Agua con conductividad < 3 µS/cm."
      },
      {
        id: "cmp-res-02",
        code: "MP-MON-AC",
        name: "Monómeros Acrílicos Metacrilato / Acrilato de Butilo (Ejemplo Demo)",
        baseQty: 460,
        unit: "kg",
        percentage: 46.0,
        density: 0.940,
        handlingNotes: "INFLAMABLE / TÓXICO. Carga hermética automatizada con línea a tierra."
      },
      {
        id: "cmp-res-03",
        code: "MP-INI-PER",
        name: "Sistema Iniciador Redox Persulfato (Ejemplo Demo)",
        baseQty: 10,
        unit: "kg",
        percentage: 1.0,
        density: 1.050,
        handlingNotes: "Preparar solución acuosa fresca antes de la inyección."
      },
      {
        id: "cmp-res-04",
        code: "MP-NEU-AMM",
        name: "Neutralizante Solución Amoniacal (Ejemplo Demo)",
        baseQty: 20,
        unit: "kg",
        percentage: 2.0,
        density: 0.910,
        handlingNotes: "CORROSIVO / VAPORES IRRITANTES. Usar máscara con filtro específico."
      },
      {
        id: "cmp-res-05",
        code: "MP-BIO-01",
        name: "Preservante Biocida Isotiazolinona (Ejemplo Demo)",
        baseQty: 10,
        unit: "kg",
        percentage: 1.0,
        density: 1.020,
        handlingNotes: "Manipular con EPP completo."
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Inertización con Nitrógeno y Pre-Emulsión",
        instruction: "Purgar reactor R-04 con nitrógeno gaseoso. Cargar agua y tensioactivos base. Calentar camisa a 78°C.",
        estDurationMin: 40,
        tempTarget: "75 - 80 °C",
        rpmTarget: 180,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Control estricto de atmósfera inerte para evitar riesgos de polimerización descontrolada.",
        equipment: "Reactor R-04"
      },
      {
        stepNum: 2,
        title: "Alimentación Continua de Monómeros e Iniciador",
        instruction: "Dosificar la mezcla monomérica en flujo continuo durante 180 minutos a temperatura de 82 ± 2°C.",
        estDurationMin: 180,
        tempTarget: "80 - 84 °C",
        rpmTarget: 220,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: La temperatura exoterma debe controlarse con agua de enfriamiento en chaqueta.",
        equipment: "Reactor R-04"
      },
      {
        stepNum: 3,
        title: "Post-Reacción, Enfriamiento y Neutralización a pH 8.5",
        instruction: "Enfriar a 35°C. Dosificar solución neutralizante MP-NEU-AMM hasta alcanzar pH 8.3 - 8.7. Adicionar biocida.",
        estDurationMin: 45,
        tempTarget: "30 - 35 °C",
        rpmTarget: 150,
        isCritical: false,
        criticalWarning: "",
        equipment: "Reactor R-04"
      }
    ],
    history: [
      {
        version: "v1.0",
        date: "2026-04-10",
        author: "Dra. Elena Valdés",
        status: "Obsoleta",
        notes: "Lanzamiento experimental."
      },
      {
        version: "v1.1",
        date: "2026-09-28",
        author: "Dra. Elena Valdés",
        status: "Aprobada",
        notes: "Versión vigente aprobada con neutralización ajustada."
      }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: "OF-2026-0042",
    batchNumber: "LOT-CER-2026-042",
    productId: "PRD-CER-001",
    productName: "UltraCera NanoShield 500 (Ejemplo Demo)",
    recipeId: "REC-CER-500-v1.2",
    recipeVersion: "v1.2",
    batchSize: 1500, // Scaled from 1000 kg (factor 1.50)
    batchUnit: "kg",
    scaleFactor: 1.50,
    status: "En curso", // "Programada", "En curso", "Completada", "Con incidencias", "Pausada"
    scheduledDate: "2026-10-29",
    targetReactor: "Reactor Dispersor R-01 (Cowles)",
    operatorAssigned: "Jorge Ramírez",
    supervisorAssigned: "Marcos Soto",
    startTime: "2026-10-29 08:30",
    endTime: null,
    priority: "Alta",
    notes: "Lote especial solicitado para cliente industrial. Escala 1.5x validada en reactor R-01.",
    components: [
      {
        id: "cmp-01",
        code: "MP-AGU-01",
        name: "Agua Desmineralizada Tratada (Ejemplo Demo)",
        targetQty: 930.0,
        unit: "kg",
        actualQty: 930.5,
        rawMaterialLot: "LOT-MP-AGU-2026-99",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.05
      },
      {
        id: "cmp-02",
        code: "MP-EMU-04",
        name: "Emulsionante No Iónico Base Éter (Ejemplo Demo)",
        targetQty: 67.5,
        unit: "kg",
        actualQty: 67.6,
        rawMaterialLot: "LOT-MP-EMU-2026-14",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.15
      },
      {
        id: "cmp-03",
        code: "MP-CER-12",
        name: "Cera Sintética Micronizada en Polvo (Ejemplo Demo)",
        targetQty: 360.0,
        unit: "kg",
        actualQty: 359.8,
        rawMaterialLot: "LOT-MP-CER-2026-08",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: -0.06
      },
      {
        id: "cmp-04",
        code: "MP-NANO-02",
        name: "Dispersión Nanométrica de Sílice Funcionalizada (Ejemplo Demo)",
        targetQty: 120.0,
        unit: "kg",
        actualQty: null, // Still pending weigh in current execution
        rawMaterialLot: "LOT-MP-NANO-2026-03",
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-05",
        code: "MP-BIO-01",
        name: "Preservante Biocida Isotiazolinona (Ejemplo Demo)",
        targetQty: 22.5,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Inspección de Reactor y Carga de Fase Acuosa",
        status: "Completado",
        instruction: "Verificar checklist de limpieza del Reactor R-01 (sin trazas de lotes anteriores). Pesar y cargar 930 kg de agua tratada. Agitación a 250 RPM.",
        estDurationMin: 20,
        tempTarget: "20 - 25 °C",
        rpmTarget: 250,
        isCritical: false,
        startedAt: "2026-10-29 08:35",
        completedAt: "2026-10-29 08:58",
        actualTemp: "22.4 °C",
        actualRpm: 250,
        operatorNote: "Reactor R-01 verificado limpio por supervisor. Conductividad de agua medida en 3.4 µS/cm.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: false
      },
      {
        stepNum: 2,
        title: "Dispersión de Tensoactivo y Homogenización",
        status: "Completado",
        instruction: "Adicionar 67.5 kg de emulsionante MP-EMU-04. Agitación 500 RPM por 15 min.",
        estDurationMin: 15,
        tempTarget: "22 - 28 °C",
        rpmTarget: 500,
        isCritical: false,
        startedAt: "2026-10-29 09:05",
        completedAt: "2026-10-29 09:22",
        actualTemp: "24.1 °C",
        actualRpm: 500,
        operatorNote: "Solución translúcida homogénea sin exceso de espuma.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: false
      },
      {
        stepNum: 3,
        title: "Incorporación de Cera y Cizallamiento Controlado",
        status: "En curso", // Current active step!
        instruction: "Cargar 360 kg de cera micronizada mediante tolva. Aumentar Cowles a 900 RPM. Monitorear que la temperatura no supere 40°C.",
        estDurationMin: 40,
        tempTarget: "32 - 38 °C",
        rpmTarget: 900,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Si la temperatura supera los 42°C la cera aglomera y arruina la estabilidad coloidal. Doble confirmación obligatoria.",
        startedAt: "2026-10-29 09:30",
        completedAt: null,
        actualTemp: "35.2 °C",
        actualRpm: 900,
        operatorNote: "Carga de cera completada al 80%. Tasa de cizalla correcta.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: true
      },
      {
        stepNum: 4,
        title: "Inyección de Nanotecnología de Sílice",
        status: "Pendiente",
        instruction: "Reducir agitación a 350 RPM. Inyectar 120 kg de MP-NANO-02 a razón de 2.5 kg/minuto.",
        estDurationMin: 35,
        tempTarget: "28 - 34 °C",
        rpmTarget: 350,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Verificar visualmente la no precipitación ni separación de fase.",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      },
      {
        stepNum: 5,
        title: "Adición de Biocida, Control de Calidad y Enfriamiento",
        status: "Pendiente",
        instruction: "Adicionar 22.5 kg de biocida a 200 RPM. Muestra para control de pH, sólidos y viscosidad.",
        estDurationMin: 25,
        tempTarget: "Ambiente (< 28°C)",
        rpmTarget: 200,
        isCritical: false,
        criticalWarning: "",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      }
    ],
    incidents: [
      {
        id: "inc-01",
        timestamp: "2026-10-29 09:12",
        type: "Observación de Proceso",
        severity: "Baja", // "Baja", "Media", "Alta"
        description: "Ligera variación en la presión de agua de enfriamiento (+0.3 bar). Se reguló manualmente válvula de retorno.",
        reportedBy: "Jorge Ramírez",
        resolved: true
      }
    ]
  },
  {
    id: "OF-2026-0041",
    batchNumber: "LOT-EST-2026-041",
    productId: "PRD-EST-002",
    productName: "UltraStucco Aquastop W-10 (Ejemplo Demo)",
    recipeId: "REC-EST-010-v2.0",
    recipeVersion: "v2.0",
    batchSize: 2000,
    batchUnit: "kg",
    scaleFactor: 1.0,
    status: "Completada",
    scheduledDate: "2026-10-28",
    targetReactor: "Mezclador Planetario M-02",
    operatorAssigned: "Jorge Ramírez",
    supervisorAssigned: "Marcos Soto",
    startTime: "2026-10-28 07:45",
    endTime: "2026-10-28 11:20",
    priority: "Normal",
    notes: "Lote estándar 2000 kg completado con parámetros conformes y liberado por Calidad.",
    components: [
      {
        id: "cmp-est-01",
        code: "MP-AGU-01",
        name: "Agua de Proceso Tratada (Ejemplo Demo)",
        targetQty: 480.0,
        unit: "kg",
        actualQty: 480.2,
        rawMaterialLot: "LOT-MP-AGU-2026-98",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.04
      },
      {
        id: "cmp-est-02",
        code: "MP-DIS-02",
        name: "Dispersante Poliacrílico Sódico (Ejemplo Demo)",
        targetQty: 12.0,
        unit: "kg",
        actualQty: 12.05,
        rawMaterialLot: "LOT-MP-DIS-2026-05",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.42
      },
      {
        id: "cmp-est-03",
        code: "MP-CAR-01",
        name: "Carbonato de Calcio Micronizado Malla 325 (Ejemplo Demo)",
        targetQty: 1100.0,
        unit: "kg",
        actualQty: 1099.5,
        rawMaterialLot: "LOT-MP-CAR-2026-44",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: -0.05
      },
      {
        id: "cmp-est-04",
        code: "MP-POL-08",
        name: "Resina Polimérica Ligante Co-acrílica (Ejemplo Demo)",
        targetQty: 340.0,
        unit: "kg",
        actualQty: 340.3,
        rawMaterialLot: "LOT-MP-POL-2026-19",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.09
      },
      {
        id: "cmp-est-05",
        code: "MP-HID-05",
        name: "Siloxano Hidrófugo Nanomodificado en Polvo (Ejemplo Demo)",
        targetQty: 50.0,
        unit: "kg",
        actualQty: 50.02,
        rawMaterialLot: "LOT-MP-HID-2026-09",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.04
      },
      {
        id: "cmp-est-06",
        code: "MP-ESP-01",
        name: "Espesante Celulósico Éter Hidroxietílico (Ejemplo Demo)",
        targetQty: 18.0,
        unit: "kg",
        actualQty: 18.0,
        rawMaterialLot: "LOT-MP-ESP-2026-02",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.0
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Carga de Agua y Dispersantes en Mezclador M-02",
        status: "Completado",
        instruction: "Cargar agua y dispersante a baja velocidad.",
        estDurationMin: 15,
        tempTarget: "Ambiente",
        rpmTarget: 150,
        isCritical: false,
        startedAt: "2026-10-28 07:50",
        completedAt: "2026-10-28 08:05",
        actualTemp: "19.5 °C",
        actualRpm: 150,
        operatorNote: "Carga conforme.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: false
      },
      {
        stepNum: 2,
        title: "Carga Progresiva de Carga Mineral Carbonatada",
        status: "Completado",
        instruction: "Adicionar los 1100 kg en 3 baches consecutivos.",
        estDurationMin: 30,
        tempTarget: "Ambiente",
        rpmTarget: 300,
        isCritical: false,
        startedAt: "2026-10-28 08:10",
        completedAt: "2026-10-28 08:42",
        actualTemp: "21.0 °C",
        actualRpm: 300,
        operatorNote: "Polvo contenido correctamente con extracción.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: false
      },
      {
        stepNum: 3,
        title: "Incorporación de Ligante y Siloxano Hidrófugo",
        status: "Completado",
        instruction: "Amasado por 20 minutos hasta pasta homogénea brillante.",
        estDurationMin: 25,
        tempTarget: "< 35 °C",
        rpmTarget: 350,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Verificar distribución uniforme del siloxano.",
        startedAt: "2026-10-28 08:48",
        completedAt: "2026-10-28 09:15",
        actualTemp: "26.3 °C",
        actualRpm: 350,
        operatorNote: "Verificado aspecto perlado uniforme por supervisor.",
        verifiedBy: "Marcos Soto",
        criticalConfirmed: true
      },
      {
        stepNum: 4,
        title: "Ajuste Reológico con Espesante y Control Final",
        status: "Completado",
        instruction: "Adicionar MP-ESP-01. Mezclar 15 min y envasar en baldes sellados.",
        estDurationMin: 20,
        tempTarget: "Ambiente",
        rpmTarget: 200,
        isCritical: false,
        startedAt: "2026-10-28 09:20",
        completedAt: "2026-10-28 09:50",
        actualTemp: "23.5 °C",
        actualRpm: 200,
        operatorNote: "Viscosidad conforme (135,000 cP). Densidad medida: 1.622 kg/L.",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: false
      }
    ],
    incidents: []
  },
  {
    id: "OF-2026-0043",
    batchNumber: "LOT-PIN-2026-043",
    productId: "PRD-PIN-003",
    productName: "HydroPaint Elastómero WP-300 (Ejemplo Demo)",
    recipeId: "REC-PIN-300-v1.0",
    recipeVersion: "v1.0",
    batchSize: 1000,
    batchUnit: "kg",
    scaleFactor: 1.0,
    status: "Programada",
    scheduledDate: "2026-10-30",
    targetReactor: "Dispersor Rápido D-03",
    operatorAssigned: "Jorge Ramírez",
    supervisorAssigned: "Marcos Soto",
    startTime: null,
    endTime: null,
    priority: "Normal",
    notes: "Lote programado para el turno de la mañana del día 30 de octubre.",
    components: [
      {
        id: "cmp-pin-01",
        code: "MP-AGU-01",
        name: "Agua de Proceso Tratada (Ejemplo Demo)",
        targetQty: 320.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-pin-02",
        code: "MP-TIO-01",
        name: "Dióxido de Titanio Rutilo Grado Pinturas (Ejemplo Demo)",
        targetQty: 180.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-pin-03",
        code: "MP-RES-ELAS",
        name: "Resina Acrílica Elastomérica Flex (Ejemplo Demo)",
        targetQty: 420.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-pin-04",
        code: "MP-HID-SIL",
        name: "Aditivo Silicónico Hidrofugante para Pinturas (Ejemplo Demo)",
        targetQty: 35.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-pin-05",
        code: "MP-COA-01",
        name: "Coalescente & Antiespumante Grado Pinturas (Ejemplo Demo)",
        targetQty: 30.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      },
      {
        id: "cmp-pin-06",
        code: "MP-BIO-02",
        name: "Fungicida / Alguicida para Exterior (Ejemplo Demo)",
        targetQty: 15.0,
        unit: "kg",
        actualQty: null,
        rawMaterialLot: null,
        weighedBy: null,
        isWeighed: false,
        deviationPct: null
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Dispersión de Pigmentos (Molienda Cowles)",
        status: "Pendiente",
        instruction: "Cargar agua y TiO2 a 1200 RPM por 25 minutos.",
        estDurationMin: 35,
        tempTarget: "25 - 35 °C",
        rpmTarget: 1200,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Finura de molienda mínima de 6 Hegman.",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      },
      {
        stepNum: 2,
        title: "Completación con Resina Elastomérica (Letdown)",
        status: "Pendiente",
        instruction: "Incorporar resina elastomérica lentamente a 350 RPM.",
        estDurationMin: 25,
        tempTarget: "< 35 °C",
        rpmTarget: 350,
        isCritical: false,
        criticalWarning: "",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      },
      {
        stepNum: 3,
        title: "Adición de Aditivo Silicónico y Estabilización",
        status: "Pendiente",
        instruction: "Añadir aditivo hidrofugante, coalescente y preservante. Mezclar 20 min.",
        estDurationMin: 30,
        tempTarget: "Ambiente",
        rpmTarget: 250,
        isCritical: false,
        criticalWarning: "",
        startedAt: null,
        completedAt: null,
        actualTemp: null,
        actualRpm: null,
        operatorNote: "",
        verifiedBy: null,
        criticalConfirmed: false
      }
    ],
    incidents: []
  },
  {
    id: "OF-2026-0040",
    batchNumber: "LOT-RES-2026-040",
    productId: "PRD-RES-004",
    productName: "UltraResin Binder AC-50 (Ejemplo Demo)",
    recipeId: "REC-RES-050-v1.1",
    recipeVersion: "v1.1",
    batchSize: 2500, // Large lot
    batchUnit: "kg",
    scaleFactor: 2.5,
    status: "Con incidencias",
    scheduledDate: "2026-10-27",
    targetReactor: "Reactor R-04",
    operatorAssigned: "Jorge Ramírez",
    supervisorAssigned: "Marcos Soto",
    startTime: "2026-10-27 10:00",
    endTime: null,
    priority: "Alta",
    notes: "Lote en observación por retención temporal debido a pico de temperatura en polimerización.",
    components: [
      {
        id: "cmp-res-01",
        code: "MP-AGU-01",
        name: "Agua Desmineralizada Pura (Ejemplo Demo)",
        targetQty: 1250.0,
        unit: "kg",
        actualQty: 1251.0,
        rawMaterialLot: "LOT-MP-AGU-2026-97",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.08
      },
      {
        id: "cmp-res-02",
        code: "MP-MON-AC",
        name: "Monómeros Acrílicos Metacrilato / Butilo (Ejemplo Demo)",
        targetQty: 1150.0,
        unit: "kg",
        actualQty: 1148.5,
        rawMaterialLot: "LOT-MP-MON-2026-02",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: -0.13
      },
      {
        id: "cmp-res-03",
        code: "MP-INI-PER",
        name: "Sistema Iniciador Redox Persulfato (Ejemplo Demo)",
        targetQty: 25.0,
        unit: "kg",
        actualQty: 25.0,
        rawMaterialLot: "LOT-MP-INI-2026-11",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.0
      },
      {
        id: "cmp-res-04",
        code: "MP-NEU-AMM",
        name: "Neutralizante Solución Amoniacal (Ejemplo Demo)",
        targetQty: 50.0,
        unit: "kg",
        actualQty: 50.0,
        rawMaterialLot: "LOT-MP-NEU-2026-04",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.0
      },
      {
        id: "cmp-res-05",
        code: "MP-BIO-01",
        name: "Preservante Biocida Isotiazolinona (Ejemplo Demo)",
        targetQty: 25.0,
        unit: "kg",
        actualQty: 25.0,
        rawMaterialLot: "LOT-MP-BIO-2026-12",
        weighedBy: "Jorge Ramírez",
        isWeighed: true,
        deviationPct: 0.0
      }
    ],
    steps: [
      {
        stepNum: 1,
        title: "Inertización con Nitrógeno y Pre-Emulsión",
        status: "Completado",
        instruction: "Purgar reactor R-04 con nitrógeno gaseoso.",
        estDurationMin: 40,
        tempTarget: "75 - 80 °C",
        rpmTarget: 180,
        isCritical: true,
        startedAt: "2026-10-27 10:10",
        completedAt: "2026-10-27 10:55",
        actualTemp: "77.5 °C",
        actualRpm: 180,
        operatorNote: "Inertización conforme (O2 < 0.5%).",
        verifiedBy: "Jorge Ramírez",
        criticalConfirmed: true
      },
      {
        stepNum: 2,
        title: "Alimentación Continua de Monómeros e Iniciador",
        status: "Completado",
        instruction: "Dosificar la mezcla durante 180 minutos a 82 ± 2°C.",
        estDurationMin: 180,
        tempTarget: "80 - 84 °C",
        rpmTarget: 220,
        isCritical: true,
        criticalWarning: "PASO CRÍTICO: Control estricto de temperatura exoterma.",
        startedAt: "2026-10-27 11:00",
        completedAt: "2026-10-27 14:15",
        actualTemp: "87.8 °C",
        actualRpm: 220,
        operatorNote: "Incidencia: Exoterma superó el límite superior momentáneamente llegando a 87.8°C a las 12:40.",
        verifiedBy: "Marcos Soto",
        criticalConfirmed: true
      },
      {
        stepNum: 3,
        title: "Post-Reacción, Enfriamiento y Neutralización a pH 8.5",
        status: "En curso",
        instruction: "Enfriar y neutralizar a pH 8.5.",
        estDurationMin: 45,
        tempTarget: "30 - 35 °C",
        rpmTarget: 150,
        isCritical: false,
        startedAt: "2026-10-27 14:30",
        completedAt: null,
        actualTemp: "33.0 °C",
        actualRpm: 150,
        operatorNote: "Lote detenido a la espera de dictamen de laboratorio de control de calidad.",
        verifiedBy: "Marcos Soto",
        criticalConfirmed: false
      }
    ],
    incidents: [
      {
        id: "inc-02",
        timestamp: "2026-10-27 12:45",
        type: "Desviación Crítica de Temperatura",
        severity: "Alta",
        description: "Exoterma alcanzó 87.8°C durante la alimentación monomérica (límite máximo permitido: 84°C). Se activó enfriamiento de emergencia en chaqueta.",
        reportedBy: "Jorge Ramírez",
        resolved: false,
        actionPlan: "Muestra enviada a laboratorio para prueba de coagulum y distribución de peso molecular antes de autorizar envasado."
      }
    ]
  }
];

export const INITIAL_AUDIT_LOG = [
  {
    id: "aud-001",
    timestamp: "2026-08-15 11:30",
    user: "Dra. Elena Valdés",
    role: "Responsable Técnico / I+D",
    action: "Aprobación de Receta",
    entity: "REC-CER-500-v1.2",
    details: "Receta 'Formulación Estándar Dispersión Cera NanoShield' aprobada oficialmente para producción."
  },
  {
    id: "aud-002",
    timestamp: "2026-09-02 16:45",
    user: "Dra. Elena Valdés",
    role: "Responsable Técnico / I+D",
    action: "Aprobación de Receta",
    entity: "REC-EST-010-v2.0",
    details: "Receta 'Fórmula Industrial Estuco Hidrófugo Mineral' v2.0 aprobada."
  },
  {
    id: "aud-003",
    timestamp: "2026-10-20 14:10",
    user: "Marcos Soto",
    role: "Supervisor de Turno",
    action: "Creación de Borrador de Receta",
    entity: "REC-CER-500-v1.3-draft",
    details: "Duplicación de REC-CER-500-v1.2 para proponer optimización con aditivo antiespumante."
  },
  {
    id: "aud-004",
    timestamp: "2026-10-27 09:30",
    user: "Marcos Soto",
    role: "Supervisor de Turno",
    action: "Creación de Orden de Fabricación",
    entity: "OF-2026-0040",
    details: "Orden creada a partir de REC-RES-050-v1.1 para lote de 2500 kg (escala 2.5x)."
  },
  {
    id: "aud-005",
    timestamp: "2026-10-27 12:45",
    user: "Jorge Ramírez",
    role: "Operario de Fabricación",
    action: "Registro de Incidencia",
    entity: "OF-2026-0040",
    details: "Desviación Crítica: Exoterma alcanzó 87.8°C en paso 2. Estado de orden cambiado a 'Con incidencias'."
  },
  {
    id: "aud-006",
    timestamp: "2026-10-28 07:30",
    user: "Marcos Soto",
    role: "Supervisor de Turno",
    action: "Creación de Orden de Fabricación",
    entity: "OF-2026-0041",
    details: "Orden creada para lote estándar 2000 kg de UltraStucco Aquastop W-10."
  },
  {
    id: "aud-007",
    timestamp: "2026-10-28 11:20",
    user: "Marcos Soto",
    role: "Supervisor de Turno",
    action: "Cierre y Liberación de Lote",
    entity: "OF-2026-0041",
    details: "Lote LOT-EST-2026-041 marcado como COMPLETADO. Todos los pesajes y pasos conformes."
  },
  {
    id: "aud-008",
    timestamp: "2026-10-29 08:15",
    user: "Marcos Soto",
    role: "Supervisor de Turno",
    action: "Creación de Orden de Fabricación",
    entity: "OF-2026-0042",
    details: "Orden creada para lote escalado de 1500 kg de UltraCera NanoShield 500."
  },
  {
    id: "aud-009",
    timestamp: "2026-10-29 09:30",
    user: "Jorge Ramírez",
    role: "Operario de Fabricación",
    action: "Confirmación de Paso Crítico",
    entity: "OF-2026-0042 / Paso 3",
    details: "Confirmación explícita de temperatura < 40°C y velocidad de cizalla a 900 RPM en dispersión de cera."
  }
];
