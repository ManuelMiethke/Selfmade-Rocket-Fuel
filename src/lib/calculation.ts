export interface CalculationInput {
  carbTarget: number;
  bottleSize: number;
  carbRatio: string;
  syrup: string;
  syrupSugar: number;
  syrupAmount: number;
  maltodextrin: boolean;
  sugar: boolean;
  sweatRate: string;
}

export interface CalculationOutput {
  syrup: number;
  maltodextrin: number;
  sugar: number;
  salt: number;
  water: number;
  totalCarbs: number;
  glucose: number;
  fructose: number;
  ratio: string;
  sodium: number;
  sweatLevel: string;
}

export const calculateRecipe = (
  input: CalculationInput
): CalculationOutput => {
  const {
    carbTarget,
    bottleSize,
    carbRatio,
    syrupSugar,
    syrupAmount,
    maltodextrin,
    sugar,
    sweatRate,
  } = input;

  let glucoseTarget = 0;
  let fructoseTarget = 0;

  if (carbRatio === '2:1') {
    glucoseTarget = carbTarget * (2 / 3);
    fructoseTarget = carbTarget * (1 / 3);
  } else if (carbRatio === '1:0.8') {
    glucoseTarget = carbTarget * (1 / 1.8);
    fructoseTarget = carbTarget * (0.8 / 1.8);
  } else {
    // Custom ratio logic will be more complex, for now, we'll just split it
    glucoseTarget = carbTarget / 2;
    fructoseTarget = carbTarget / 2;
  }

  // Syrup contribution (assuming 50/50 glucose/fructose)
  const syrupCarbs = (syrupAmount * syrupSugar) / 100;
  const glucoseFromSyrup = syrupCarbs / 2;
  const fructoseFromSyrup = syrupCarbs / 2;

  let glucoseNeeded = glucoseTarget - glucoseFromSyrup;
  let fructoseNeeded = fructoseTarget - fructoseFromSyrup;

  let maltodextrinGrams = 0;
  let sugarGrams = 0;

  if (fructoseNeeded > 0 && sugar) {
    sugarGrams = fructoseNeeded * 2;
    glucoseNeeded -= fructoseNeeded; // account for glucose from sugar
  }

  if (glucoseNeeded > 0 && maltodextrin) {
    maltodextrinGrams = glucoseNeeded;
  }

  // Sodium calculation
  let sodiumTarget = 0;
  if (sweatRate === 'low') {
    sodiumTarget = 400;
  } else if (sweatRate === 'medium') {
    sodiumTarget = 600;
  } else {
    sodiumTarget = 900;
  }
  const sodiumMg = (sodiumTarget * bottleSize) / 1000;
  const saltGrams = sodiumMg / 400;

  const totalCarbs = syrupCarbs + maltodextrinGrams + sugarGrams;
  const totalGlucose = glucoseFromSyrup + maltodextrinGrams + sugarGrams / 2;
  const totalFructose = fructoseFromSyrup + sugarGrams / 2;
  const achievedRatio =
    totalFructose > 0
      ? `1:${(totalGlucose / totalFructose).toFixed(2)}`
      : 'N/A';

  return {
    syrup: syrupAmount,
    maltodextrin: Math.round(maltodextrinGrams),
    sugar: Math.round(sugarGrams),
    salt: Math.round(saltGrams * 10) / 10,
    water: bottleSize > syrupAmount ? bottleSize - syrupAmount : 0,
    totalCarbs: Math.round(totalCarbs),
    glucose: Math.round(totalGlucose),
    fructose: Math.round(totalFructose),
    ratio: achievedRatio,
    sodium: Math.round(sodiumMg),
    sweatLevel: sweatRate,
  };
};
