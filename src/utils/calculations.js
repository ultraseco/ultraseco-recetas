// =========================================================================
// CÁLCULOS INDUSTRIALES Y VALIDACIONES DE LOTE
// =========================================================================

/**
 * Calcula el escalado de una receta a partir de un tamaño objetivo y unidad.
 * Maneja conversión explícita de Masa <-> Volumen requiriendo densidad aprobada.
 */
export function calculateBatchScaling({
  recipe,
  targetSize,
  targetUnit,
  customDensity = null,
  precision = 2
}) {
  if (!recipe || !targetSize || targetSize <= 0) {
    return {
      isValid: false,
      error: "Especifique un tamaño de lote válido mayor a 0."
    };
  }

  const baseUnit = recipe.baseUnit || "kg";
  let targetEquivalentBaseUnit = targetSize;
  let conversionApplied = null;

  // Validación y conversión estricta masa / volumen
  const isTargetVolume = ["L", "l", "litros", "litro"].includes(targetUnit);
  const isBaseMass = ["kg", "kilogramos", "kilo"].includes(baseUnit);
  const isTargetMass = ["kg", "kilogramos", "kilo"].includes(targetUnit);
  const isBaseVolume = ["L", "l", "litros", "litro"].includes(baseUnit);

  const density = customDensity !== null && customDensity !== undefined 
    ? Number(customDensity) 
    : (recipe.densityRef || 1.0);

  if (isTargetVolume && isBaseMass) {
    // Objetivo en Litros, receta en Kg: Masa (kg) = Volumen (L) * Densidad (kg/L)
    if (!density || density <= 0) {
      return {
        isValid: false,
        error: "Conversión masa/volumen requiere una densidad aprobada mayor a 0 kg/L."
      };
    }
    targetEquivalentBaseUnit = targetSize * density;
    conversionApplied = {
      type: "vol_to_mass",
      formula: `Masa (${baseUnit}) = Volumen (${targetUnit}) × Densidad (${density.toFixed(3)} kg/L)`,
      densityUsed: density,
      originalValue: targetSize,
      convertedValue: targetEquivalentBaseUnit
    };
  } else if (isTargetMass && isBaseVolume) {
    // Objetivo en Kg, receta en Litros: Volumen (L) = Masa (kg) / Densidad (kg/L)
    if (!density || density <= 0) {
      return {
        isValid: false,
        error: "Conversión masa/volumen requiere una densidad aprobada mayor a 0 kg/L."
      };
    }
    targetEquivalentBaseUnit = targetSize / density;
    conversionApplied = {
      type: "mass_to_vol",
      formula: `Volumen (${baseUnit}) = Masa (${targetUnit}) ÷ Densidad (${density.toFixed(3)} kg/L)`,
      densityUsed: density,
      originalValue: targetSize,
      convertedValue: targetEquivalentBaseUnit
    };
  } else if (targetUnit !== baseUnit) {
    // Unidades diferentes no configuradas
    return {
      isValid: false,
      error: `No se puede convertir automáticamente entre ${targetUnit} y ${baseUnit} sin una regla física aprobada.`
    };
  }

  // Factor de escala exacto
  const scaleFactor = targetEquivalentBaseUnit / recipe.baseBatchSize;

  // Validaciones de límites operacionales del reactor
  const minBatch = recipe.minBatchSize || 0;
  const maxBatch = recipe.maxBatchSize || Infinity;
  const isOutOfRange = targetEquivalentBaseUnit < minBatch || targetEquivalentBaseUnit > maxBatch;
  let rangeWarning = null;

  if (targetEquivalentBaseUnit < minBatch) {
    rangeWarning = `ADVERTENCIA: El lote calculado (${targetEquivalentBaseUnit.toFixed(1)} ${baseUnit}) está por DEBAJO del mínimo recomendado del reactor (${minBatch} ${baseUnit}). Riesgo de mala agitación / nivel bajo de paleta.`;
  } else if (targetEquivalentBaseUnit > maxBatch) {
    rangeWarning = `ADVERTENCIA: El lote calculado (${targetEquivalentBaseUnit.toFixed(1)} ${baseUnit}) SUPERA la capacidad máxima de seguridad del reactor (${maxBatch} ${baseUnit}). Riesgo de desborde y espumación.`;
  }

  // Cálculo de componentes proporcionales
  const factorPow = Math.pow(10, precision);
  let totalCalculatedExact = 0;
  let totalRounded = 0;

  const scaledComponents = (recipe.components || []).map((comp) => {
    const rawCalculated = comp.baseQty * scaleFactor;
    const rounded = Math.round(rawCalculated * factorPow) / factorPow;
    const delta = rounded - rawCalculated;

    totalCalculatedExact += rawCalculated;
    totalRounded += rounded;

    return {
      ...comp,
      scaleFactor,
      rawCalculated,
      roundedQty: rounded,
      deltaRounding: delta,
      targetUnit: comp.unit
    };
  });

  const totalRoundingDelta = totalRounded - totalCalculatedExact;

  return {
    isValid: true,
    scaleFactor,
    targetEquivalentBaseUnit,
    baseBatchSize: recipe.baseBatchSize,
    baseUnit,
    targetUnit,
    conversionApplied,
    isOutOfRange,
    rangeWarning,
    minBatch,
    maxBatch,
    precision,
    scaledComponents,
    totalCalculatedExact,
    totalRounded,
    totalRoundingDelta
  };
}

/**
 * Calcula la desviación porcentual entre el peso real y el teórico.
 */
export function calculateDeviation(actual, target) {
  if (actual === null || actual === undefined || target === null || target === undefined || target === 0) {
    return null;
  }
  const diff = actual - target;
  return (diff / target) * 100;
}
