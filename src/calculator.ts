export type Ratio = {
  glucose: number;
  fructose: number;
};

export type Intensity = 1 | 2 | 3 | 4 | 5;

export type CalculatorInputs = {
  carbTarget: number; // in grams
  volume: number; // in ml
  ratio: Ratio;
  useSyrup: boolean;
  syrupMixRatioWater: number; // e.g. 6 for 1:6
  syrupSugarPer100mlPrepared: number; // in grams
  syrupTasteIntensity: Intensity;
  sweatRate: Intensity;
};

export type Recipe = {
  maltodextrin: number; // g
  tableSugar: number; // g
  syrup: number; // ml
  salt: number; // g
  water: number; // ml
};

export function calculateRecipe(inputs: CalculatorInputs): Recipe {
  const {
    carbTarget,
    volume,
    ratio,
    useSyrup,
    syrupMixRatioWater,
    syrupSugarPer100mlPrepared,
    syrupTasteIntensity,
    sweatRate,
  } = inputs;

  // 1. Target Glucose & Fructose
  const totalParts = ratio.glucose + ratio.fructose;
  const targetGlucose = carbTarget * (ratio.glucose / totalParts);
  const targetFructose = carbTarget * (ratio.fructose / totalParts);

  // 2. Syrup Calculation
  let syrupMl = 0;
  let syrupSugarG = 0;

  if (useSyrup) {
    const intensityMultiplier = 
      syrupTasteIntensity === 1 ? 20 : 
      syrupTasteIntensity === 2 ? 30 : 
      syrupTasteIntensity === 3 ? 40 : 
      syrupTasteIntensity === 4 ? 50 : 60;
    syrupMl = intensityMultiplier * (volume / 500);

    const pureSyrupSugarPer100ml = syrupSugarPer100mlPrepared * (1 + syrupMixRatioWater);
    syrupSugarG = (pureSyrupSugarPer100ml / 100) * syrupMl;
  }

  const syrupGlucose = syrupSugarG * 0.5;
  const syrupFructose = syrupSugarG * 0.5;

  // 3. Table Sugar (Sucrose)
  const remainingFructose = Math.max(0, targetFructose - syrupFructose);
  const tableSugarNeeded = remainingFructose * 2;
  const sugarGlucose = tableSugarNeeded * 0.5;

  // 4. Maltodextrin (100% Glucose)
  const remainingGlucose = Math.max(0, targetGlucose - syrupGlucose - sugarGlucose);
  const maltodextrinNeeded = remainingGlucose;

  // 5. Sodium / Salt Calculation
  const sodiumPerLiter = 
    sweatRate === 1 ? 400 : 
    sweatRate === 2 ? 600 : 
    sweatRate === 3 ? 800 : 
    sweatRate === 4 ? 1000 : 1200;
  const targetSodiumMg = sodiumPerLiter * (volume / 1000);
  const saltNeeded = (targetSodiumMg / 1000) / 0.3934;

  // 6. Water Calculation
  const waterNeeded = Math.max(0, volume - syrupMl);

  return {
    maltodextrin: Math.round(maltodextrinNeeded * 10) / 10,
    tableSugar: Math.round(tableSugarNeeded * 10) / 10,
    syrup: Math.round(syrupMl),
    salt: Math.round(saltNeeded * 100) / 100,
    water: Math.round(waterNeeded),
  };
}