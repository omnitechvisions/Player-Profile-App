export function getLevelFromXp(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 250) + 1);
}

export function getProgressToNextLevel(totalXp: number) {
  const currentLevelXp = Math.floor(totalXp / 250) * 250;
  return ((totalXp - currentLevelXp) / 250) * 100;
}
