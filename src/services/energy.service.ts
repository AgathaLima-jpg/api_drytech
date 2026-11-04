export function energyPerKg(totalEnergy: number, initialWeight: number) {
  return initialWeight > 0 ? totalEnergy / initialWeight : null;
}
